import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isValidToken } from '../utils/token/isValidToken';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const storedAuthStatus = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const validToken = await isValidToken();
                console.log('isValidToken result:', validToken);
                setIsAuthenticated(validToken);
            } catch (error) {
                console.error("Token validation error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkToken();
    }, []);
    const location = useLocation();

    useEffect(() => {
        console.log('Location changed:', location);
    }, [location]);

    if (isLoading) {
        return <Loading />;
    }

    console.log('AppRoutes rendered:', { isAuthenticated, storedAuthStatus });

    return (
        <Routes>
            {isAuthenticated && storedAuthStatus && (
                <>
                    {console.log("User is  authenticated")}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Navigate to="/home" replace />} />
                    <Route path="/signup" element={<Navigate to="/home" replace />} />
                    <Route path="/forgotpassword" element={<Navigate to="/home" replace />} />
                </>
            )}
            {!storedAuthStatus && !isAuthenticated && (
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
