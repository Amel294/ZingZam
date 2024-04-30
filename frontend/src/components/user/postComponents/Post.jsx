import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Input, useDisclosure, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Heart from "/public/icons/Heart";
import { useState } from "react";
import Share from "/public/icons/Share";
import BookMark from "/public/icons/BookMark";
import toast, { Toaster } from "react-hot-toast";
import CommentModal from "../comment/CommentModal";
import dummyPost from '/Post/rain.jpg'
import { useNavigate } from 'react-router-dom';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useDispatch, useSelector } from 'react-redux';
import { updateLikeCountAndUserLiked } from "../../../store/auth/postsSlice";
import LikeModel from "../like/LikeModel";
import Comments from "./Comments";
import MenuDots from "../../../../public/icons/MenuDots";
import CaptionModal from "./CaptionModal";
import AddFriend from "../../../../public/icons/AddFriend";

export default function Post({ post, postId }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth)
    const [isLikeOpen, setIsLikeOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCaptionOpen, setIsCaptionOpen] = useState(false);
    const handlesavePost = async (postId) => {
        // const response = await AxiosWithBaseURLandCredentials.post(`/post/saveunsave`, { postId });
        // if (response.data.saved === true) {
        //     setSaved(true)
        //     toast.success(response.data.message)
        // }
        // else if (response.data.saved === false) {
        //     setSaved(false)

        //     toast.success(response.data.message)
        // } else toast.error("Removed from Saved")
    }
    const navigate = useNavigate()

    const handleGoToProfile = () => {
        navigate(`/profile/${ post?.postedBy[0]?.username }`);
    }

    const handleLike = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/post/likeunlike`, { postId });
            console.log(postId)
            if (response.data.userLiked) {
                toast.success("Post Liked");
                dispatch(updateLikeCountAndUserLiked({ postId, likeCount: response.data.newLikeCount, userLiked: response.data.userLiked }));
            } else if (!response.data.userLiked) {
                toast.success("Post Unliked");
                dispatch(updateLikeCountAndUserLiked({ postId, likeCount: response.data.newLikeCount, userLiked: response.data.userLiked }));
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };
    const handleClose = () => {
        setIsCaptionOpen(false);
    };
    return (
        <>
            {post &&
                <>
                    <Card className="max-w-[400px] ">
                        <CardHeader className="flex justify-between">
                            <div className="flex gap-3 cursor-pointer" onClick={handleGoToProfile}>
                                <Avatar showFallback name={post?.postedBy[0]?.name} alt="nextui logo" height={40} radius="full" src={post?.postedBy[0]?.picture} width={40} />
                                <div className="flex flex-col text-left justify-between">
                                    {post?.type === "A-own" ?
                                        <>
                                            <p className="text-md" >{user?.name}</p>
                                            <p className="text-xs" >@{user?.username}</p>
                                        </>
                                        :
                                        <>
                                            <p className="text-md" >{post?.postedBy[0]?.name}</p>
                                            <p className="text-xs" >@{post?.postedBy[0]?.username}</p>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {post?.type === "C-public" &&
                                    <Button
                                        className="border-none transition-transform duration-300 transform-gpu hover:scale-105"
                                        variant="bordered"
                                        size="sm"
                                        endContent={<AddFriend className="fill-white hover:fill-secondary-400  size-5" />}
                                        isIconOnly
                                    />
                                }
                                <Dropdown className="dark text-whi fill-white hover:fill-secondary-400">
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered" size="sm" isIconOnly className="fill-white shadow-none border-none "
                                        >
                                            <MenuDots />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                                        {post?.type === "A-own" &&
                                            <DropdownItem
                                                onClick={() => setIsCaptionOpen(true)}
                                                key="edit-post"
                                            >
                                                Change Caption
                                            </DropdownItem>}
                                        {post?.type !== "A-own" &&
                                            <DropdownItem
                                                key="report-post"
                                            >
                                                Report
                                            </DropdownItem>}
                                        {post?.type === "A-own" &&
                                            <DropdownItem
                                                className="bg-red-800"
                                                key="delete-post"
                                            >
                                                Delete Post
                                            </DropdownItem>}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <Image
                                alt="nextui logo"
                                // height={40}
                                radius="sm"
                                src={post?.imageUrl || dummyPost}
                                width={380}
                                onError={() => console.error("Error loading image:", img)}

                            />
                            <p className="pt-2">{post?.caption} </p>
                        </CardBody>
                        <Divider />
                        <CardFooter className="flex flex-row justify-between">
                            <div className="flex items-center gap-1">
                                <Heart className="rounded-none m-1 hover:cursor-pointer" height="25px" fill={post?.userLiked ? "#661FCC" : "none"} stroke={post?.userLiked ? "none" : "#661FCC"} strokeWidth="2px" onClick={() => handleLike(post._id)} />
                                <p><span className="hover:cursor-pointer text-sm" onClick={() => setIsLikeOpen(true)}>{post?.likeCount} Likes</span></p>
                            </div>
                            <div className="flex flex-row gap-10">
                                <Share height="25px" fill="#661FCC" />
                                <BookMark height="25px" fill={post?.userSaved ? "#661FCC" : "none"} stroke={post?.userSaved ? "none" : "#661FCC"} onClick={() => handlesavePost(post?._id)} />
                            </div>
                        </CardFooter>
                        <Comments postId={postId} postType={post?.type} userId={user.id} />

                    </Card >
                    <CommentModal className="my-0 py-0" isOpen={isOpen} setIsOpen={setIsOpen} />
                    <LikeModel isLikeOpen={isLikeOpen} setIsLikeOpen={setIsLikeOpen} postId={post?._id} likedUsers={post?.likedUsers} likeCount={post?.likeCount} />
                    <CaptionModal handleClose={handleClose} postId={post?._id} captionText={post?.caption} setIsCaptionOpen={setIsCaptionOpen} isCaptionOpen={isCaptionOpen} />
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />
                </>
            }
        </>
    );
}
