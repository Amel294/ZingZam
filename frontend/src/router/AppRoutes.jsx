import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/Loading';
import MainNavLayout from './layouts/MainNavLayout';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import FooterLayout from './layouts/FooterLayout';
import NotFound from '../pages/user/NotFound';
import AdminHome from '../pages/admin/AdminHome';
import ForgotPassword from '../pages/user/ForgotPassword';
import Profile from '../pages/user/Profile';
import { resetAuth } from '../store/auth/authSlice';
import { resetPost } from '../store/auth/postsSlice';
import { resetTempToken } from '../store/auth/tempTokenSlice';
import AdminNavLayout from './layouts/AdminNavLayout';
import { resetUserPosts } from '../store/auth/userPostsSlice';
import Stream from '../pages/user/games/Stream';
import ContentModeration from '../pages/admin/ContentModeration';

const AppRoutes = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const storedAuthStatus = useSelector(state => state.auth.isLoggedIn);
    const storedAdminAuthStatus = useSelector(state => state.adminAuth.isLoggedIn);
    useEffect(() => {
        const checkRefreshToken = () => {
            const cookies = document.cookie.split(';');
            const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
            if (!refreshTokenCookie) {
                dispatch(resetAuth());
                dispatch(resetPost())
                dispatch(resetUserPosts())
                dispatch(resetTempToken())
            }
        };
        checkRefreshToken();
    }, []);
    if (isLoading) {
        return <Loading />;
    }

    return (

        <Routes>
            {storedAdminAuthStatus && (
                <>
                    <Route element={<AdminNavLayout />}>
                        <Route path="/admin" index element={<AdminHome />} />
                        <Route path="/contentmodration" element={<ContentModeration />} />
                    </Route>
                </>
            )}
            {!storedAdminAuthStatus && (
                <>
                    <Route path="/admin" element={<Navigate to="/login" replace />} />
                </>
            )}
            {storedAuthStatus && (
                <>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Navigate to="/home" replace />} />
                    <Route path="/signup" element={<Navigate to="/home" replace />} />
                    <Route path="/forgotpassword" element={<Navigate to="/home" replace />} />
                </>
            )}
            {!storedAuthStatus && (
                <>
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
                <Route path="/stream" element={<Stream />} />
            </Route>
            <Route >
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
};

export default AppRoutes;
