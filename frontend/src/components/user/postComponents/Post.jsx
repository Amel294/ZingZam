import { Card, CardHeader, CardBody, CardFooter, Divider,  Image, Button, Input } from "@nextui-org/react";
import avatar from '/public/Avatar/amel.jpg'
import user2 from '/public/Avatar/user2.jpg'
import dummyPost from '/Post/rain.jpg'
import Heart from "/public/icons/Heart";
import { useState } from "react";
import Share from "/public/icons/Share";
import BookMark from "/public/icons/BookMark";
import toast, { Toaster } from "react-hot-toast";
import CommentModal from "../comment/CommentModal";

export default function Post() {
    const author = "Amel K Umesh"
    const handle = "idle head"
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const handleBookmark = () => {
        setBookmarked(!bookmarked)
        if (!bookmarked) toast.success("Added to Saved")
        else toast.error("Removed from Saved")
    }
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Card className="max-w-[400px]">
                <CardHeader className="flex justify-between">
                    <div className="flex gap-3">
                        <Image alt="nextui logo" height={40} radius="lg" src={avatar} width={40} />
                        <div className="flex flex-col text-left">
                            <p className="text-md">{handle}</p>
                            <p className="text-small text-default-500">{author}</p>
                        </div>
                    </div>
                    <Button color="secondary" variant="bordered" size="sm">
                        Follow
                    </Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Image
                        alt="nextui logo"
                        // height={40}
                        radius="sm"
                        src={dummyPost}
                        width={380}
                    />
                    <p className="pt-2">beautiful rain in </p>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-row justify-between">
                    <div className="flex items-center gap-1">
                        <Heart className="rounded-none m-1" height="25px" fill={liked ? "#661FCC" : "none"} stroke={liked ? "none" : "#661FCC"} strokeWidth="2px" onClick={() => setLiked(!liked)} />
                        <p><span>120 Likes</span><span> . </span><span>12 Comments</span> </p>
                    </div>
                    <div className="flex flex-row gap-10">
                        <Share height="25px" fill="#661FCC" />
                        <BookMark height="25px" fill={bookmarked ? "#661FCC" : "none"} stroke={bookmarked ? "none" : "#661FCC"} onClick={handleBookmark} />
                    </div>
                </CardFooter>
                <CardFooter className="flex flex-col gap-2 items-start pb-0 w-full ">
                    <div className="flex flex-row gap-4">
                        <div >
                            <img className="rounded-full" src={user2} alt="avatar" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs">Amel&nbsp;&nbsp;  </span>
                            <span> This is amazing</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div >
                            <img className="rounded-full" src={user2} alt="avatar" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs">Amel&nbsp;&nbsp;  </span>
                            <span> This is amazing</span>
                        </div>
                    </div>

                    <div className=" underline cursor-pointer" onClick={() => setIsOpen(true)}>Show more comments</div>
                </CardFooter>
                <CardFooter className="pt-0">
                    <div className="flex flex-row items-end w-full gap-2">
                    <Input type="email" variant="underlined" label="Add a comment" />
                    <Button size="sm"> Post </Button>

                    </div>
                </CardFooter>
            </Card>
            <CommentModal className="my-0 py-0" isOpen={isOpen} setIsOpen={setIsOpen} />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    );
}
