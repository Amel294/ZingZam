const NodeMediaServer = require('node-media-server');
const axios = require('axios'); 

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60,
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

function getStreamKeyFromStreamPath(path) {
    let parts = path.split('/');
    return parts[parts.length - 1];
}

async function validateStreamKeyWithBackend(streamKey) {
    try {
        const response = await axios.post('http://localhost:8000/stream/stream-key-validate', { streamKey: streamKey });
        return response.data.isValid;
    } catch (error) {
        console.error('Error validating stream key:', error.message);
        return false;
    }
}

nms.on('prePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]', `id=${ id } StreamPath=${ StreamPath } args=${ JSON.stringify(args) }`);
    const streamKey = getStreamKeyFromStreamPath(StreamPath);
    const isValid = await validateStreamKeyWithBackend(streamKey);
    if (!isValid) {
        let session = nms.getSession(id);
        session.reject();
        console.log('Rejected stream with invalid key:', streamKey);
    } else {
        console.log('Stream key is valid:', streamKey);
    }
});

nms.run();
