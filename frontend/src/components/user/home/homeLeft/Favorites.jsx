import { Card, Chip, Avatar, Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import SavedIcon from "../../../../../public/icons/SavedIcon";
import FavoritesIcon from "../../../../../public/icons/FavoritesIcon";
function Favorites() {
    const userDetails = useSelector(state => state.auth);
    console.log("user details are");
    console.log(userDetails);
    return (
        <>
            <div className="w-[300px]">
                <Card className="pb-2">
                    <div className=" w-full bg-secondary-400 flex justify-center p-2">
                        <FavoritesIcon />
                        <Chip className=" w-full" variant="light" >
                            Favorite&apos;s
                        </Chip>

                    </div>
                    <div className="p-4 w-full ">
                        <div className="grid grid-cols-3 justify-between gap-4">
                            <div className="flex justify-center">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                            </div>
                            <div className="flex justify-center">
                                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                            </div>
                            <div className="flex justify-center">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 w-full ">
                        <div className="grid grid-cols-3 justify-between gap-4">
                            <div className="flex justify-center">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                            </div>
                            <div className="flex justify-center">
                                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                            </div>
                            <div className="flex justify-center">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                            </div>
                        </div>
                    </div>
                    <Button radius="full" size="sm" className="bg-secondary-400 text-white m-4">
                        Add More 
                    </Button>
                </Card>
            </div>
        </>
    )
}

export default Favorites
