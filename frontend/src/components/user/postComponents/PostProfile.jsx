import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Heart from "/public/icons/Heart";
import Share from "/public/icons/Share";
import BookMark from "/public/icons/BookMark";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useSelector } from 'react-redux';
import LikeModel from "../like/LikeModel";
import Comments from "./Comments";
import MenuDots from "../../../../public/icons/MenuDots";
import CaptionModal from "./CaptionModal";
import AddFriend from "../../../../public/icons/AddFriend";

export default function PostProfile({ postId }) {
    const [post, setPost] = useState();
    const [isLikeOpen, setIsLikeOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCaptionOpen, setIsCaptionOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [userLiked, setUserLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const user = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            try {
                const response = await AxiosWithBaseURLandCredentials.get(`/post/get-Post/${ postId }`);
                const postData = response.data;
                setPost(postData);
                setSaved(postData?.userSaved);
                setUserLiked(postData?.userLiked);
                setLikeCount(postData?.likeCount);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [postId, isCaptionOpen]);

    const handleGoToProfile = () => {
        navigate(`/profile/${ post?.postedBy[0]?.username }`);
    };

    const handleLike = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/post/likeunlike`, { postId });
            if (response.data.userLiked === true) {
                setUserLiked(true);
                setLikeCount(response.data.newLikeCount);
                toast.success("Post Liked");
            } else if (response.data.userLiked === false) {
                setUserLiked(false);
                setLikeCount(response.data.newLikeCount);
                toast.success("Post Unliked");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const handlesavePost = async () => {
        const response = await AxiosWithBaseURLandCredentials.post(`/post/saveunsave`, { postId: post?._id });
        if (response.data.saved === true) {
            setSaved(true);
            toast.success(response.data.message);
        } else if (response.data.saved === false) {
            setSaved(false);
            toast.success(response.data.message);
        } else {
            toast.error("Failed to save/unsave post");
        }
    };

    const handleClose = () => {
        setIsCaptionOpen(false);
    };

    return (
        <>
            {post && saved !== undefined && userLiked !== undefined &&
                <>
                    <Card className="max-w-[400px] flex">
                        <CardHeader className="flex justify-between">
                            <div className="flex gap-3 cursor-pointer" onClick={handleGoToProfile}>
                                <Avatar showFallback name={post?.postedBy[0]?.name} alt="nextui logo" height={40} radius="full" src={post?.postedBy[0]?.picture} width={40} />
                                <div className="flex flex-col text-left justify-between">
                                    <p className="text-md">{post?.postedBy[0]?.name}</p>
                                    <p className="text-xs">@{post?.postedBy[0]?.username}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Dropdown className="dark text-white fill-white hover:fill-secondary-400">
                                    <DropdownTrigger>
                                        <Button variant="bordered" size="sm" isIconOnly className="fill-white shadow-none border-none ">
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
                                radius="sm"
                                src={post?.imageUrl || dummyPost}
                                width={380}
                                onError={() => console.error("Error loading image")}
                            />
                            <p className="pt-2">{post?.caption}</p>
                        </CardBody>
                        <Divider />
                        <CardFooter className="flex flex-row justify-between">
                            <div className="flex items-center gap-1">
                                <Heart
                                    className="rounded-none m-1 hover:cursor-pointer"
                                    height="25px"
                                    fill={userLiked ? "#661FCC" : "none"}
                                    stroke={userLiked ? "none" : "#661FCC"}
                                    strokeWidth="2px"
                                    onClick={handleLike}
                                />
                                <p>
                                    <span className="hover:cursor-pointer text-sm" onClick={() => setIsLikeOpen(true)}>
                                        {likeCount} Likes
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-row gap-10">
                                <Share height="25px" fill="#661FCC" />
                                <BookMark
                                    height="25px"
                                    fill={saved ? "#661FCC" : "none"}
                                    stroke={saved ? "none" : "#661FCC"}
                                    onClick={handlesavePost}
                                />
                            </div>
                        </CardFooter>
                        <Comments postId={postId} postType={post?.type} userId={user.id} />
                    </Card>
                    <CaptionModal handleClose={handleClose} postId={post?._id} captionText={post?.caption} setIsCaptionOpen={setIsCaptionOpen} isCaptionOpen={isCaptionOpen} />
                    <Toaster position="top-center" reverseOrder={false} />
                </>
            }
        </>
    );
}
