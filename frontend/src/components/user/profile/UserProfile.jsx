import { Card, CardBody, Image, Button, useDisclosure, Avatar, Tooltip } from "@nextui-org/react";
import EditIcon from "../../../../public/icons/EditIcon";
import EditName from "./EditName";
import { useSelector } from "react-redux";
import EditUserName from "./EditUserName";
import { useState } from "react";

export function UserProfile({ userData, picture, defaultAvatar }) {

    const handleNameOpen = () => {
        onOpen();
    };
    const handleUsernameOpen = () => {
        setIsNameChangeModelOpen(true)
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isNameChangeModelOpen, setIsNameChangeModelOpen] = useState(false);

    const ownUser = useSelector(state => state.auth);

    return (
        <>
            <Card className='w-[400px]'>
                <CardBody>
                    <div className=' grid grid-cols-3 gap-4 w-full items-center'>
                        <div className="flex flex-col col-span-1 items-center relative top-0">
                            <Avatar radius="sm" className="w-28 h-28 text-large" src={userData?.picture == "" ? defaultAvatar : userData.picture} />
                            {userData.ownProfile === true && (
                                <Button size="sm" className="absolute z-10 bottom-2 opacity-20 fill-secondary-400  transition-opacity duration-300 hover:opacity-100" color="secondary">
                                    Change Image
                                </Button>
                            )}
                        </div>
                        <div className=' grid grid-rows-2 col-span-2'>
                            <div className="flex justify-between items-start row-span-1">
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center w-full gap-2">
                                        <h3 className="font-semibold">
                                            {userData.ownProfile === true ? ownUser.name : userData.name}
                                        </h3>
                                        {userData.ownProfile === true && (
                                            <Tooltip content="Change Name" color="secondary" placement="bottom" delay={0}>
                                                <Button size="sm" isIconOnly className="p-0 bg-transparent">
                                                    <EditIcon className="ml-2 fill-secondary-400 size-4" onClick={handleNameOpen} />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <div className="flex items-center w-full gap-2">
                                    <h3 className="text-small text-foreground/80">
                                            @{userData.ownProfile === true ? ownUser.username : userData.username}
                                        </h3>
                                        {userData.ownProfile === true && (
                                            <Tooltip content="Change Username" color="secondary" placement="bottom" delay={0}>
                                                <Button size="sm" isIconOnly className="p-0 bg-transparent">
                                                    <EditIcon className="ml-2 fill-secondary-400 size-4" onClick={handleUsernameOpen} />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-start row-span-1 overflow-auto text-sm">
                                {userData.ownProfile === true && userData.bio === '' ? <Button size="sm">Add Bio</Button> : <div>{userData.bio}</div>}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card >
            <EditName isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            <EditUserName isNameChangeModelOpen={isNameChangeModelOpen} setIsNameChangeModelOpen={setIsNameChangeModelOpen} />
        </>
    )
}
