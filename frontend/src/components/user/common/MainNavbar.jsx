import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image, Divider } from '@nextui-org/react';
import MainLogo from '/icons/ZingZamLogo.svg';
import GameSide from '/icons/MainGame.svg';
import SocialSide from '/icons/MainSocial.svg';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { logoutUser, resetAuth } from '../../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { resetPost } from '../../../store/auth/postsSlice';
import { useState, useEffect } from 'react';
import Search from '../search/Search';
import { resetUserPosts } from '../../../store/auth/userPostsSlice';
import { SearchIcon } from '../../../../public/icons/SearchIcon';
import DropDownAvatar from './DropDownAvatar';
import io from 'socket.io-client';

export default function MainNavbar() {
    const navigate = useNavigate();
    const currentUserId = useSelector(state => state.auth.id); // Get the current user ID from Redux store
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (currentUserId) { // Ensure socket connects only if user ID is available
            const socket = io('http://localhost:8000', {
                query: { userId: currentUserId }, // Pass the logged-in user's ID
            });

            socket.on('notification', (data) => {
                setNotifications(prev => [...prev, data]);
            });

            return () => socket.disconnect(); // Clean up the socket connection on component unmount
        }
    }, [currentUserId]); // Dependency array ensures effect runs when user ID changes

    const handleNotificationClick = (streamKey) => {
        navigate(`/stream/${streamKey}`);
    };

    const handleSearchOpen = () => {
        setIsSearchOpen(true);
    };

    return (
        <>
            <Navbar isBordered isBlurred={false}>
                <NavbarBrand>
                    <Link onClick={() => navigate(`/`)} className="cursor-pointer" aria-current="page">
                        <Image radius="none" isBlurred width={35} alt="ZingZam logo" src={MainLogo} />
                        <p className="ps-4 font-bold text-secondary-500">Zing Zam</p>
                    </Link>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem isActive>
                        <Button aria-current="page" className='bg-transparent p-0' onClick={() => navigate(`/stream`)}>
                            <Image isZoomed radius="none" isBlurred width={35} alt="Game side logo" src={GameSide} className="p-1" />
                        </Button>
                    </NavbarItem>
                    <Divider orientation="vertical" className="h-7" />
                    <NavbarItem isActive>
                        <Button aria-current="page" className='bg-transparent p-0' onClick={() => navigate(`/home`)}>
                            <Image isZoomed radius="none" isBlurred width={35} alt="Social side side logo" src={SocialSide} className="p-1" />
                        </Button>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem className='flex items-center gap-2'>
                        <Button as={Link} color="secondary" variant="light" onClick={handleSearchOpen} startContent={<SearchIcon />}>
                            <span className="text-white">Search</span>
                        </Button>
                        <div className="relative">
                            <button className="relative">
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{notifications.length}</span>
                                <i className="bell-icon" /> {/* Replace with your bell icon */}
                            </button>
                            {notifications.length > 0 && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                    {notifications.map((notification, index) => (
                                        <div key={index} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleNotificationClick(notification.data.streamKey)}>
                                            {notification.message}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <DropDownAvatar />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        </>
    );
}
