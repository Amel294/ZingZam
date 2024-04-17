import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Input } from "@nextui-org/react";
import avatar from '/public/Avatar/amel.jpg'
import Heart from "/public/icons/Heart";
import { useState, useEffect } from "react";
import Share from "/public/icons/Share";
import BookMark from "/public/icons/BookMark";
import toast, { Toaster } from "react-hot-toast";
import CommentModal from "../comment/CommentModal";
import dummyPost from '/Post/rain.jpg'
import { useNavigate } from 'react-router-dom';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

export default function Post({ post, userId }) {
    const [liked, setLiked] = useState(post.liked)
    const [saved, setSaved] = useState(post.saved)
    const [commentCount,setCommentCount] = useState(post.commentCount)
    const [comments, setComments] = useState(post.comments)
    const [writeComment, setWriteComment] = useState("")
    useEffect(() => {

        console.log("comments", comments)
    })
    const handleDeleteComment = async (postId, commentId) => {
        const response = await AxiosWithBaseURLandCredentials.delete(`/post/comment/${ postId }/${ commentId }`, {
            withCredentials: true
        });
        if (response.status === 200) {
            toast.success("Comment Posted")
            setCommentCount(prevCount => prevCount - 1);
            const newComment = await AxiosWithBaseURLandCredentials.post(`/post/get-comment-fromPostId`, { postId });
            console.log("newComment", newComment)
            setComments(newComment.data)
        }
        console.log(response)
    }
    const handlesavePost = async (postId) => {
        const response = await AxiosWithBaseURLandCredentials.post(`/post/saveunsave`, { postId });
        if (response.data.saved === true) {
            setSaved(true)
            toast.success(response.data.message)
        }
        else if (response.data.saved === false) {
            setSaved(false)

            toast.success(response.data.message)
        } else toast.error("Removed from Saved")
    }
    const navigate = useNavigate()
    console.log("Post in innermost is")
    console.log(post)
    const [isOpen, setIsOpen] = useState(false);
    const handleGoToProfile = () => {
        navigate(`/profile/${ post.user.username }`);
    }
    const addComment = async (postId) => {
        const response = await AxiosWithBaseURLandCredentials.post(`/post/addcomment`, { postId, comment: writeComment });
        if (response.status === 200) {
            toast.success("Comment Posted")
            setWriteComment('')
            setCommentCount(prevCount => prevCount + 1);

            const newComment = await AxiosWithBaseURLandCredentials.post(`/post/get-comment-fromPostId`, { postId });
            console.log("newComment", newComment)
            setComments(newComment.data)
        }
    }
    const handleLike = async (postId) => {
        try {
            const response = await AxiosWithBaseURLandCredentials.post(`/post/likeunlike`, { postId });
            if (response.data.message === "Post liked") {
                setLiked(true)
                toast.success(response.data.message)
            }
            else if (response.data.message === "Post unliked") {
                setLiked(false)
                toast.success(response.data.message)
            } else {
                toast.error("Something went wrong")
            }
        } catch (err) {
            console.log(err)
        }
    };
    return (
        <>
            <Card className="max-w-[400px] ">
                <CardHeader className="flex justify-between">
                    <div className="flex gap-3 cursor-pointer" onClick={handleGoToProfile}>
                        <Image alt="nextui logo" height={40} radius="lg" src={post.user.picture} width={40} />
                        <div className="flex flex-col text-left">
                            <p className="text-md" >{post.user.username}</p>
                            <p className="text-small text-default-500">{post.user.name}</p>
                        </div>
                    </div>
                    {post.user._id !== userId ?
                        <>
                            <Button color="secondary" variant="bordered" size="sm">
                                Follow
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
                        <Heart className="rounded-none m-1 hover:cursor-pointer" height="25px" fill={liked ? "#661FCC" : "none"} stroke={liked ? "none" : "#661FCC"} strokeWidth="2px" onClick={() => handleLike(post._id)} />
                        <p><span>{post?.likeCount} Likes</span><span> |  </span><span>{commentCount ? commentCount : 0} Comments</span> </p>
                    </div>
                    <div className="flex flex-row gap-10">
                        <Share height="25px" fill="#661FCC" />
                        <BookMark height="25px" fill={saved ? "#661FCC" : "none"} stroke={saved ? "none" : "#661FCC"} onClick={() => handlesavePost(post?._id)} />
                    </div>
                </CardFooter>
                {comments && comments.length > 0 ? (
                    <CardFooter className="flex flex-col gap-2 items-start pb-0 w-full">
                        {comments.map(comment => (
                            <div key={comment._id} className="flex justify-between w-full">
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <img className="rounded-full w-10" src={comment.picture} alt="avatar" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs">{comment?.username}&nbsp;&nbsp;</span>
                                        <span>{comment.text}</span>
                                    </div>
                                </div>
                                <Button size="sm"  onClick={()=>handleDeleteComment(post._id,comment._id)}>Delete</Button>
                                {/* del action for authenticated user only */}
                            </div>
                        ))}
                        <div className="underline cursor-pointer" onClick={() => setIsOpen(true)}>Show more comments</div>
                    </CardFooter>
                ) : (
                    <div>No comments</div>
                )}
                <CardFooter className="pt-0">
                    <div className="flex flex-row items-end w-full gap-2">
                        <Input type="email" variant="underlined" label="Add a comment" value={writeComment} onChange={(event) => setWriteComment(event.target.value)} />
                        <Button size="sm" onClick={() => addComment(post._id)}> Post </Button>
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
