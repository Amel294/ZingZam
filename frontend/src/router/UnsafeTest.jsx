import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MainNavLayout from './layouts/MainNavLayout';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import NotFound from '../pages/user/NotFound';
import AdminHome from '../pages/admin/AdminHome';
import UserManagement from '../components/admin/userManagement/UserManagement';
import ContentModeration from '../pages/admin/ContentModeration';

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
            <Route >
                <Route path="/admin" index element={<AdminHome />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/moderation" element={<ContentModeration />} />
            </Route>
        </Routes>
    );
};

export default UnsafeTest;
