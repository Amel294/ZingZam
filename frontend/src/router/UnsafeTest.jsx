import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isValidToken } from '../utils/token/isValidToken';
import { useSelector } from 'react-redux';

import MainNavLayout from './layouts/MainNavLayout';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import NotFound from '../pages/user/NotFound';

const UnsafeTest = () => {
    
    return (
        <Routes>
            
            <Route element={<MainNavLayout />}>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
            </Route>
            <Route >
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>
            <Route path="*" element={<NotFound/>} />

        </Routes>
    );
};

export default UnsafeTest;
