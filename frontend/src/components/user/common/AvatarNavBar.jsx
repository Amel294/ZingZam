import { Avatar } from "@nextui-org/react";
import { useSelector } from "react-redux";
export default function AvatarNavBar() {
    const user = useSelector((state) => state.auth);
    return (
        <>
            <Avatar variant="light" color="secondary" src={user.picture} />
        </>
    );
}
