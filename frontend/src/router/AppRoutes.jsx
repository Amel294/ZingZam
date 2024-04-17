import {  useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import MainNavLayout from './layouts/MainNavLayout';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import FooterLayout from './layouts/FooterLayout';
import NotFound from '../pages/user/NotFound';
import UserManagement from '../components/admin/userManagement/UserManagement';
import AdminHome from '../pages/admin/AdminHome';
import ForgotPassword from '../pages/user/ForgotPassword';
import Profile from '../pages/user/Profile';

const AppRoutes = () => {
    const [isLoading, setIsLoading] = useState(false);
    const storedAuthStatus = useSelector(state => state.auth.isLoggedIn);
    console.log("storedAuthStatus",storedAuthStatus);
    if (isLoading) {
        return <Loading />;
    }

    console.log('AppRoutes rendered:', {  storedAuthStatus });

    return (
        <Routes>
            { storedAuthStatus && (
                <>
                    {console.log("User is  authenticated")}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Navigate to="/home" replace />} />
                    <Route path="/signup" element={<Navigate to="/home" replace />} />
                    <Route path="/forgotpassword" element={<Navigate to="/home" replace />} />
                </>
            )}
            {!storedAuthStatus &&  (
                <>
                    {console.log("User is not authenticated")}
                    <Route index element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/home" element={<Navigate to="/login" replace />} />
                    <Route path="/profile/:username" element={<Navigate to="/login" replace />} />
                </>
            )}

            <Route element={<MainNavLayout />}>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile/:username" element={<Profile />} />
            </Route>
            <Route >
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
            </Route>
            <Route >
                <Route path="/admin" index element={<AdminHome />} />
                <Route path="/usermanagement" element={<UserManagement />} />
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
};

export default AppRoutes;
