import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image, Divider } from '@nextui-org/react';
import MainLogo from '/icons/ZingZamLogo.svg';
import GameSide from '/icons/MainGame.svg';
import SocialSide from '/icons/MainSocial.svg';
import { useDispatch } from 'react-redux';
import { logoutUser, resetAuth } from '../../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {  resetPost } from '../../../store/auth/postsSlice';
import { useState } from 'react';
import Search from '../search/Search'
import { resetUserPosts } from '../../../store/auth/userPostsSlice';
import { SearchIcon } from '../../../../public/icons/SearchIcon';
import DropDownAvatar from './DropDownAvatar';
export default  function MainNavbar() {
    
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
                <NavbarItem className='flex items-center gap-2'>
                    <Button as={Link} color="secondary"  variant="light" onClick={handleSearchOpen}  startContent={<SearchIcon/>}>
                        <span className="text-white">Search</span>
                    </Button>
                    <DropDownAvatar/>
                    {/* <Button as={Link} color="secondary" href="#" variant="flat" onClick={handleLogOut} className="bg-secondary-400">
                        <span className="text-white">Log Out</span>
                    </Button> */}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        </>
    );
}
