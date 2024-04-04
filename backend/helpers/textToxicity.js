const axios = require('axios');

exports.textToxicity = async (caption) =>{
    const options = {
        method: 'POST',
        url: 'https://text-moderator.p.rapidapi.com/api/v1/moderate',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.TEXT_TOXICITY_API_KEY,
            'X-RapidAPI-Host': 'text-moderator.p.rapidapi.com'
        },
        data: { input: `${caption}` }
    };
    
    try {
        const response = await axios.request(options);
        return response.data
    } catch (error) {
        console.error(error);
    }

}