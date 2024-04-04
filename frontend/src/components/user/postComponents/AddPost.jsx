import {  Button, useDisclosure, Card, CardBody, Divider, Image, CardHeader } from "@nextui-org/react";
import Avatar from '/Avatar/amel.jpg'
import PhotoAndVideo from '/icons/photoAndVideo.svg'
import Live from '/icons/live.svg'
import Feeling from '/icons/feeling.svg'
import AddPostModal from "./AddPostModal";

export default function AddPost() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>

            <Card className="flex grow max-w-[400px] md:max-w-[440px] md:min-w-[400px]">
                <CardHeader className="flex gap-3" >
                    <Image
                        alt="nextui logo"
                        height={30}
                        radius="full"
                        src={Avatar}
                        width={30}
                    />
                    <div className="flex grow ">
                        <Button radius={"lg"} size="md" fullWidth="true" onPress={onOpen}
                        className="">How are you feeling today?Amel</Button>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="flex justify-evenly">

                        <Button onPress={onOpen} variant="light" className="rounded-lg">
                            <img className="h-4 " src={Live} alt="" />
                            Live
                        </Button>
                        <Button onPress={onOpen} variant="light" className="rounded-lg mx-2">
                            <img className="h-4" src={PhotoAndVideo} alt="" />
                            Photo / Video
                        </Button>
                        <Button onPress={onOpen} variant="light" className="rounded-lg mx-2">
                            <img className="h-4" src={Feeling} alt="" />
                            Feelings
                        </Button>
                    </div>

                </CardBody>

            </Card>
            <AddPostModal isOpen={isOpen} onOpenChange={onOpenChange}/>
        </>

    );
}
