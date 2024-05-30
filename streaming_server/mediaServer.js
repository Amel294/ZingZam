const NodeMediaServer = require('node-media-server');
const axios = require('axios');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 600,
        gop_cache: false,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 7000,
        allow_origin: '*',
        mediaroot: './media',
        webroot: './www',
        flv: {
            maxConnections: 1000,
            path: '/flv'
        }
    }
};

const nms = new NodeMediaServer(config);

const reconnectAttempts = {};
const activeStreams = {};

function getStreamKeyFromStreamPath(path) {
    let parts = path.split('/');
    return parts[parts.length - 1];
}

async function validateStreamKeyWithBackend(streamKey) {
    try {
        const response = await axios.post(`${process.env.BASE_URL_BACKEND}/stream/stream-key-validate`, { streamKey: streamKey });
        return response.data.isValid;
    } catch (error) {
        console.error('Error validating stream key:', error.message);
        return false;
    }
}

async function setStreamActive(streamKey) {
    try {
        const response = await axios.patch(`${process.env.BASE_URL_BACKEND}/stream/activateStream`, { streamKey: streamKey });
        return response.status === 200;
    } catch (error) {
        console.log('Error activating stream:', error.message);
        return false;
    }
}

async function setStreamInactive(streamKey) {
    try {
        const response = await axios.patch(`${process.env.BASE_URL_BACKEND}/stream/deactivateStream`, { streamKey: streamKey });
        return response.status === 200;
    } catch (error) {
        console.log('Error deactivating stream:', error.message);
        return false;
    }
}

function checkInactivity(streamKey) {
    if (activeStreams[streamKey]) {
        const now = Date.now();
        if (now - activeStreams[streamKey].lastActive > 60000) { // 1 minute inactivity
            console.log(`Stream ${streamKey} has been inactive for 1 minute. Deactivating.`);
            setStreamInactive(streamKey);
            delete activeStreams[streamKey];
        }
    }
}

nms.on('prePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    const streamKey = getStreamKeyFromStreamPath(StreamPath);
    const isValid = await validateStreamKeyWithBackend(streamKey);
    const streamIsActivated = await setStreamActive(streamKey);

    if (!isValid || !streamIsActivated) {
        let session = nms.getSession(id);
        session.reject();
        console.log('Rejected stream with invalid or inactive key:', streamKey);
        return;
    }

    console.log('Stream key is valid and activated:', streamKey);

    // Initialize or reset reconnect attempts and active stream tracking
    reconnectAttempts[streamKey] = (reconnectAttempts[streamKey] || 0) + 1;
    activeStreams[streamKey] = { lastActive: Date.now() };

    if (reconnectAttempts[streamKey] > 10) {
        let session = nms.getSession(id);
        session.reject();
        console.log('Rejected stream with excessive reconnect attempts:', streamKey);
        return;
    }

    // Check for inactivity
    setInterval(() => checkInactivity(streamKey), 60000);
});

nms.on('postPublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    const streamKey = getStreamKeyFromStreamPath(StreamPath);
    activeStreams[streamKey].lastActive = Date.now();
});

nms.on('donePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    const streamKey = getStreamKeyFromStreamPath(StreamPath);

    try {
        const response = await axios.patch(`${process.env.BASE_URL_BACKEND}/stream/deactivateStream`, { streamKey: streamKey });
        console.log('Stream stopped API call response:', response.data);
    } catch (error) {
        console.error('Error sending stream stopped API call:', error.message);
    }

    delete reconnectAttempts[streamKey];
    delete activeStreams[streamKey];
});

nms.run();
