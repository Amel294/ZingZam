require('dotenv').config();
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
const maxReconnectionAttempts = 5;
let reconnectionAttempts = {};
let blacklist = {};

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
        console.log(error);
        return false;
    }
}

nms.on('prePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    const streamKey = getStreamKeyFromStreamPath(StreamPath);
    if (blacklist[streamKey]) {
        let session = nms.getSession(id);
        session.reject();
        console.log('Rejected stream with blacklisted key:', streamKey);
        return;
    }
    const isValid = await validateStreamKeyWithBackend(streamKey);
    if (!isValid) {
        let session = nms.getSession(id);
        session.reject();
        console.log('Rejected stream with invalid key:', streamKey);
        return;
    }
    const streamIsActivated = await setStreamActive(streamKey);
    if (!streamIsActivated) {
        let session = nms.getSession(id);
        session.reject();
        console.log('Failed to activate stream:', streamKey);
        return;
    }
    reconnectionAttempts[streamKey] = 0;
    console.log('Stream key is valid and stream activated:', streamKey);
});

nms.on('donePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    const streamKey = getStreamKeyFromStreamPath(StreamPath);
    try {
        const response = await axios.patch(`${process.env.BASE_URL_BACKEND}/stream/deactivateStream`, { streamKey: streamKey });
        console.log('Stream stopped API call response:', response.data);
        reconnectionAttempts[streamKey] = (reconnectionAttempts[streamKey] || 0) + 1;
        if (reconnectionAttempts[streamKey] > maxReconnectionAttempts) {
            console.log(`Max reconnection attempts reached for streamKey: ${streamKey}. Adding to blacklist.`);
            blacklist[streamKey] = true;
        }
    } catch (error) {
        console.error('Error sending stream stopped API call:', error.message);
    }
});

nms.run();
