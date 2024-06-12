import { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image, Divider, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@nextui-org/react';
import MainLogo from '/icons/ZingZamLogo.svg';
import GameSide from '/icons/MainGame.svg';
import SocialSide from '/icons/MainSocial.svg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../../../../public/icons/SearchIcon';
import DropDownAvatar from './DropDownAvatar';
import io from 'socket.io-client';
import Search from '../search/Search';
import { NotificationIcon } from '../../../../public/icons/NotificationIcon';
import MainSocial from '../../../../public/icons/MainSocial';
import MainGame from '../../../../public/icons/MainGame';
import AvatarNavBar from './AvatarNavBar';
import { SearchIconLarge } from '../../../../public/icons/SearchIconLarge';

export default function MainNavbar() {
    const navigate = useNavigate();
    const currentUserId = useSelector(state => state.auth.id);
    const currentUserName = useSelector(state => state.auth.username);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let socket;
        if (currentUserId) {
            socket = io(`${ import.meta.env.VITE_BASE_URL_SOCKET }`, {
                query: { userId: currentUserId },
            });

            socket.on('notification', (data) => {
                console.log('Received notification:', data);
                setNotifications(prev => [...prev, data]);
            });

            socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [currentUserId]);

    const handleNotificationClick = (streamKey) => {
        navigate(`/streamgame/${ streamKey }`);
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
                        <Dropdown placement="bottom-right">
                            <DropdownTrigger>
                                <Button isIconOnly auto variant="light">
                                    <Badge content={notifications.length} placement="top-right" shape="circle" color="success">
                                        <NotificationIcon />
                                    </Badge>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Notification Menu">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <DropdownItem key={index} onClick={() => handleNotificationClick(notification.streamKey)}>
                                            {notification.message}
                                        </DropdownItem>
                                    ))
                                ) : (
                                    <DropdownItem>No new notifications</DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <DropDownAvatar />
                    </NavbarItem>
                </NavbarContent>
                <div className='sm:hidden bg-black border-t-1 border-gray-400 fixed bottom-0 left-0 w-full z-30 h-16 flex items-center justify-center gap-2'>
                    <div className='flex w-[75vw] items-center justify-between'>
                        <Button onClick={() => navigate(`/`)} isIconOnly className='bg-transparent'><MainSocial /></Button>
                        <Button onClick={() => navigate(`/stream`)} isIconOnly className='bg-transparent'><MainGame /></Button>
                        <Button as={Link} color="secondary" className='bg-transparent' onClick={handleSearchOpen} startContent={<SearchIconLarge />} isIconOnly>
                        </Button>
                        <Button onClick={() => navigate(`/profile/${ currentUserName }`)} isIconOnly className='bg-transparent'><AvatarNavBar /></Button>
                    </div>
                </div>
            </Navbar>
            <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />

        </>
    );
}
