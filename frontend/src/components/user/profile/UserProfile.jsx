import { Card, CardBody, Image, Button, useDisclosure } from "@nextui-org/react";
import EditIcon from "../../../../public/icons/EditIcon";
import EditName from "./EditName";

export function UserProfile({ userData, picture, defaultAvatar }) {

    const handleNameOpen = () => {
        onOpen();
    };
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Card className='w-[400px]'>
                <CardBody>
                    <div className=' grid grid-cols-3 gap-4 w-full'>
                        <div className="flex flex-col  col-span-1 items-center relative">
                            <Image className=' h-48  object-cover' shadow="sm" radius="lg" alt="Profile pic" src={userData?.picture == "" ? defaultAvatar : userData.picture} />
                            {userData.ownProfile === true && <Button size="sm" className="absolute z-10 bottom-2 opacity-60 ml-2 fill-secondary-400 px-2 py-1" color="secondary" > Change Image </Button>}
                        </div>
                        <div className=' grid grid-rows-2   col-span-2'>
                            <div className="flex justify-between items-start row-span-1">
                                <div className="flex flex-col gap-0 w-full">
                                    <div className='flex items-center w-full '>
                                        <h3 className="font-semibold ">{userData.name}</h3>
                                        {userData.ownProfile === true && <EditIcon className="ml-2 fill-secondary-400 size-4" onClick={handleNameOpen} />}
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <p className="text-small text-foreground/80">{userData.username}</p>
                                        {userData.ownProfile === true && <EditIcon className="ml-2 fill-secondary-400 size-4" />}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-start row-span-1 overflow-auto text-sm">
                                {userData.ownProfile === true && userData.bio === '' ? <Button size="sm">Add Bio</Button> : <div>{userData.bio}</div>}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <EditName isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </>
    )
}
