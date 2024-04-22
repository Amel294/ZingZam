// axiosInterceptor.js

import axios from 'axios';

const AxiosWithBaseURLandCredentials = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true 
});

AxiosWithBaseURLandCredentials.interceptors.request.use(
    function (config) {
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
        const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
        const adminToken = document.cookie.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
        console.log(refreshToken)
        if(!refreshToken && !adminToken){
            console.log("no refresh token")
            window.location.href = '/login'
        }
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

AxiosWithBaseURLandCredentials.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("response from axios");
        console.log(error);

        if(error?.response?.data?.blocked  ){
            console.log("user is blocked")
            window.location.href = '/login'
        }
    }
);

export default AxiosWithBaseURLandCredentials;
