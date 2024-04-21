import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image, Divider } from '@nextui-org/react';
import MainLogo from '/icons/ZingZamLogo.svg';
import GameSide from '/icons/MainGame.svg';
import SocialSide from '/icons/MainSocial.svg';
import { useDispatch } from 'react-redux';
import { logoutUser, resetAuth } from '../../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {  resetPost } from '../../../store/auth/postsSlice';
import { resetOwnPost } from '../../../store/auth/ownPostSlice';
import { useState } from 'react';
import Search from '../search/Search'
export default  function MainNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleRedirectToLogin = () => {
        dispatch(resetPost())
        dispatch(resetAuth())
        dispatch(resetOwnPost())
        dispatch(resetPost())
        navigate("/login");
    };
    const handleLogOut = async () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        await dispatch(logoutUser());
        setTimeout(()=>{
            handleRedirectToLogin()
        },2000)
    }
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const handleSearchOpen = () =>{
        console.log('search open')
        setIsSearchOpen(true)
    } 
    return (
        <>
        <Navbar isBordered isBlurred={false}>
            <NavbarBrand>
                <Link href="/" aria-current="page">
                    <Image radius="none" isBlurred width={35} alt="ZingZam logo" src={MainLogo} />
                    <p className="ps-4 font-bold text-secondary-500">Zing Zam</p>
                </Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        <Image isZoomed radius="none" isBlurred width={35} alt="Game side logo" src={GameSide} className="p-1" />
                    </Link>
                </NavbarItem>
                <Divider orientation="vertical" className="h-7" />
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        <Image isZoomed radius="none" isBlurred width={35} alt="Social side side logo" src={SocialSide} className="p-1" />
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="secondary" href="#" variant="flat" onClick={handleSearchOpen} className="bg-secondary-400">
                        <span className="text-white">Search</span>
                    </Button>
                    <Button as={Link} color="secondary" href="#" variant="flat" onClick={handleLogOut} className="bg-secondary-400">
                        <span className="text-white">Log Out</span>
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        </>
    );
}
