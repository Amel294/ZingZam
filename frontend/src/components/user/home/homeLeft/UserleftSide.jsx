import { Card, Chip, Button, Avatar } from "@nextui-org/react";
import { useSelector } from "react-redux";
import SavedIcon from "../../../../../public/icons/SavedIcon";
import FriendsIcon from "../../../../../public/icons/FriendsIcon";
import { useNavigate } from "react-router-dom";

function UserleftSide() {
    const navigate = useNavigate()
    const userDetails = useSelector(state => state.auth);
    return (
        <>
            <div className="w-[300px]">
                <Card className="pb-2">
                    <div className=" w-full bg-secondary-400 flex items-center justify-center p-2 hover:bg-secondary-300 cursor-pointer  gap-2">
                        <Avatar showFallback name={userDetails?.name} alt="nextui logo" height={40} radius="full" src={userDetails?.picture} />
                        <Chip className=" w-full text-md" variant="light" onClick={() => navigate("/profile/" + userDetails.username)} >
                            {userDetails.name}
                        </Chip>

                    </div>
                    <Button className="m-2 flex justify-start" al startContent={<SavedIcon />} variant="light">
                        Saved Posts
                    </Button>
                    <Button className="m-2 flex justify-start" al startContent={<FriendsIcon />} variant="light">
                        Friends
                    </Button>
                </Card>
            </div>
        </>
    )
}

export default UserleftSide
