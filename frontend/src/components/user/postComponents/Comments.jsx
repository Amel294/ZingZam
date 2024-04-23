import { useEffect, useState } from "react";
import { Avatar, Button, CardFooter } from "@nextui-org/react";
import toast from "react-hot-toast";
import DeleteIcon from "../../../../public/icons/DeleteIcon";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

function Comments({ postId, postType, userId }) {
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);

    const getComments = async (postId) => {
        console.log("Req for get comments")
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/post/get-comments/${ postId }/1/2`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setComments(response.data.comments);
                setCommentCount(response.data.totalComments);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
            toast.error("Failed to fetch comments");
        }
    };

    useEffect(() => {
        getComments(postId);
    }, [postId]);
    const handleDeleteComment = async (postId, commentId) => {
        const response = await AxiosWithBaseURLandCredentials.delete(`/post/comment/${ postId }/${ commentId }`, {
            withCredentials: true
        });
        if (response.status === 200) {
            toast.success("Comment Deleted")
            setCommentCount(prevCount => prevCount - 1);
            const newComment = await AxiosWithBaseURLandCredentials.post(`/post/get-comment-fromPostId`, { postId });
            console.log("newComment", newComment)
            setComments(newComment.data)
        }
        console.log(response)
    }
    return (
        <div>
            <div>
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.commentId} className="flex justify-between w-full">
                            <div className="flex flex-row gap-4">
                                <div>
                                    <Avatar src={comment.picture} size="sm" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs">{comment.username}&nbsp;&nbsp;</span>
                                    <span>{comment.text}</span>
                                    <span className="text-xs opacity-50">Reply</span>
                                </div>
                            </div>
                            {    console.log('user comment inner post', userId)}
                            {(postType === "own" || comment.userId === userId) && (
                                <Button isIconOnly size="sm" onClick={() => handleDeleteComment(postId, comment.commentId)}>
                                    <DeleteIcon />
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No comments</div>
                )}
            </div>

            <CardFooter className="flex flex-col gap-2 items-start pb-0 w-full">
                {/* ... (Your Comment Input and Posting Logic Here) */}
            </CardFooter>
        </div>
    );
}

export default Comments;
