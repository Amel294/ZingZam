// axiosInterceptor.js

import axios from 'axios';

const AxiosWithBaseURLandCredentials = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true // set to true if your server needs credentials (cookies)
});

AxiosWithBaseURLandCredentials.interceptors.request.use(
    function (config) {
        // Access the accessToken and refreshToken cookies
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
        const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
        
        // Add the accessToken and refreshToken to the request headers if available
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;
        }
        
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

AxiosWithBaseURLandCredentials.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

export default AxiosWithBaseURLandCredentials;
