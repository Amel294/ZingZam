import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, User } from "@nextui-org/react";
import DropDownIcon from "../../../../public/icons/DropDownIcon";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPost } from "../../../store/auth/postsSlice";
import { resetUserPosts } from "../../../store/auth/userPostsSlice";
import { logoutUser, resetAuth } from "../../../store/auth/authSlice";
export default function DropDownAvatar() {
    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleRedirectToLogin = () => {
        dispatch(resetPost())
        dispatch(resetAuth())
        dispatch(resetUserPosts())
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
        setTimeout(() => {
            handleRedirectToLogin()
        }, 2000)
    }
    return (
        <Dropdown className="dark text-white"
            showArrow
            radius="sm"
            classNames={{
                base: "before:bg-default-200",
                content: "p-0 border-small border-divider bg-background",
            }}
        >
            <DropdownTrigger >
                <Button variant="light" color="secondary" className="flex text-center  gap-2 items-center" endContent={<DropDownIcon className="w-3 fill-secondary-400 " />}>
                    <User
                        name={<span className="hidden md:block text-white">{user.name}</span>}
                        classNames={{
                            name: "text-sec-600",
                            description: "text-default-500 ",
                        }}
                        avatarProps={{
                            size: "sm",
                            showFallback:true,
                            fallback : `${user.name.slice(0,2)}`,
                            src: `${ user.picture }`,
                        }}
                    />
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Custom item styles"
                className="p-3"
                itemClasses={{
                    base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                    ],
                }}
            >
                <DropdownSection aria-label="Profile & Actions" showDivider>
                    <DropdownItem key="profile">
                        Profile
                    </DropdownItem>
                    <DropdownItem key="settings">Settings</DropdownItem>
                </DropdownSection>
                <DropdownSection aria-label="Logout">
                    <DropdownItem className="text-danger" color="danger" key="logout" onClick={handleLogOut}>Log Out</DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
}
