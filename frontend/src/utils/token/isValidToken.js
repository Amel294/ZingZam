import axios from 'axios';

export async function isValidToken() {
    try {
        const response = await axios.post('http://localhost:8000/api/validateAccessToken', {}, {
            withCredentials: true
        });
        // console.log("user Access   " + response.data.isValid)
        if (response.data.isValid === true) {
            return true
        }
        return false
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
}
