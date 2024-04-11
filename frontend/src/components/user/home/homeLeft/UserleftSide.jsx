import { Card,  Chip,  Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import SavedIcon from "../../../../../public/icons/SavedIcon";
import FriendsIcon from "../../../../../public/icons/FriendsIcon";
function UserleftSide() {
    const userDetails = useSelector(state => state.auth);
    console.log("user details are");
    console.log(userDetails);
    return (
        <>
            <div className="w-[300px]">
                <Card className="pb-2">
                    <div className=" w-full bg-secondary-400 flex justify-center p-2 hover:bg-secondary-300 cursor-pointer  gap-2">
                        <img src={userDetails.picture || "https://via.placeholder.com/150"} className="rounded-full w-8 " />
                        <Chip className=" w-full text-md" variant="light"  >
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
