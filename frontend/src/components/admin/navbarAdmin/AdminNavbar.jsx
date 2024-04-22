import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import MainLogo from "../../../../public/icons/MainLogo";
import { useDispatch, useSelector } from "react-redux";
import {  resetAdminAuth } from "../../../store/auth/adminAuthSlice";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
    const isAdminLoggedIn = useSelector(state => state.adminAuth.isLoggedIn)
    console.log("isAdminLoggedIn")
    console.log(isAdminLoggedIn)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        await dispatch(resetAdminAuth());
        setTimeout(()=>{
            navigate("/login");
        },2000)
    }
    return (
        <Navbar isBordered>
            <NavbarBrand>
                <div className="flex gap-2 ">

                <MainLogo />
                <p className="font-bold text-inherit">Zing Zam</p>
                </div>
            </NavbarBrand>
            <NavbarContent justify="end">
                {!isAdminLoggedIn ? (
                    <>
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
                    </>
                ):(
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat" onClick={handleLogOut}>
                        Log Out
                    </Button>
                </NavbarItem>
                    
                )}
            </NavbarContent>
        </Navbar>
    );
}
