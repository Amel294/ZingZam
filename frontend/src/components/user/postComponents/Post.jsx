import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Input, useDisclosure, Avatar } from "@nextui-org/react";
import Heart from "/public/icons/Heart";
import { useEffect, useState } from "react";
import Share from "/public/icons/Share";
import BookMark from "/public/icons/BookMark";
import toast, { Toaster } from "react-hot-toast";
import CommentModal from "../comment/CommentModal";
import dummyPost from '/Post/rain.jpg'
import { useNavigate } from 'react-router-dom';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useDispatch, useSelector } from 'react-redux';
import { updateLatestComments, updateLikeCountAndUserLiked } from "../../../store/auth/postsSlice";
import LikeModel from "../like/LikeModel";
import Comments from "./Comments";

export default function Post({ post }) {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.id)

    console.log('user inner post', userId)
    const [isLikeOpen, setIsLikeOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
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
    console.log("Post in innermost is")
    console.log(post)
    const handleGoToProfile = () => {
        navigate(`/profile/${ post.user.username }`);
    }
    
    const handleLike = async (postId) => {
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
    return (
        <>
            <Card className="max-w-[400px] ">
                <CardHeader className="flex justify-between">
                    <div className="flex gap-3 cursor-pointer" onClick={handleGoToProfile}>
                        <Image alt="nextui logo" height={40} radius="lg" src={post.postedBy.picture} width={40} />
                        <div className="flex flex-col text-left">
                            <p className="text-md" >{post.postedBy.username}</p>
                        </div>
                    </div>
                    {post.type !== "own" ?
                        <>
                            <Button color="secondary" variant="bordered" size="sm">
                                + Add
                            </Button>
                        </> : null
                    }
                </CardHeader>
                <Divider />
                <CardBody>
                    <Image
                        alt="nextui logo"
                        // height={40}
                        radius="sm"
                        src={post.imageUrl || dummyPost}
                        width={380}
                        onError={() => console.error("Error loading image:", img)} // Log if there's an error

                    />
                    <p className="pt-2">{post.caption} </p>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-row justify-between">
                    <div className="flex items-center gap-1">
                        <Heart className="rounded-none m-1 hover:cursor-pointer" height="25px" fill={post.userLiked ? "#661FCC" : "none"} stroke={post.userLiked ? "none" : "#661FCC"} strokeWidth="2px" onClick={() => handleLike(post._id)} />
                        <p><span className="hover:cursor-pointer text-sm" onClick={() => setIsLikeOpen(true)}>{post?.likeCount} Likes</span></p>
                    </div>
                    <div className="flex flex-row gap-10">
                        <Share height="25px" fill="#661FCC" />
                        <BookMark height="25px" fill={post.userSaved ? "#661FCC" : "none"} stroke={post.userSaved ? "none" : "#661FCC"} onClick={() => handlesavePost(post?._id)} />
                    </div>
                </CardFooter>
                <Comments postId={post._id} postType={post.type} userId={userId}/>
                
            </Card >
            <CommentModal className="my-0 py-0" isOpen={isOpen} setIsOpen={setIsOpen} />
            <LikeModel isLikeOpen={isLikeOpen} setIsLikeOpen={setIsLikeOpen} postId={post._id} likedUsers={post.likedUsers} likeCount={post.likeCount} />
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    );
}
