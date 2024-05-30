// axiosInterceptorSignInSignUp.js

import axios from 'axios';

const axiosInterceptorSignInSignUp = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_BACKEND,
    withCredentials: true 
});

axiosInterceptorSignInSignUp.interceptors.request.use(
    function (config) {
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
        const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
        const adminToken = document.cookie.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
        
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;
        }
        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInterceptorSignInSignUp.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log(error);
    }
);

export default axiosInterceptorSignInSignUp;
