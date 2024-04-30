import { useEffect, useState } from "react";
import { Avatar, Button, CardFooter, Input } from "@nextui-org/react";
import toast from "react-hot-toast";
import DeleteIcon from "../../../../public/icons/DeleteIcon";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

function Comments({ postId, postType, userId }) {
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [writeComment, setWriteComment] = useState("");
    const [reply, setReply] = useState("")
    const [parentCommentId, setParentCommentId] = useState("")

    const getComments = async (postId) => {
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
    }
    const handleGetReplies = async (commentId) => {
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/post/replies/${ commentId }`, {
                withCredentials: true
            });
            if (response.status === 200) {
                const fetchedReplies = response.data;
                const updatedComments = comments.map(comment => {
                    if (comment.commentId === commentId) {
                        return {
                            ...comment,
                            replies: fetchedReplies
                        };
                    }
                    return comment;
                });
                setComments(updatedComments);
            }
        } catch (error) {
            console.error("Failed to fetch replies:", error);
            toast.error("Failed to fetch replies");
        }
    }
    const addComment = async () => {
        const response = await AxiosWithBaseURLandCredentials.post(`/post/addcomment`, { postId, comment: writeComment });
        if (response.status === 200) {
            toast.success("Comment Posted")
            setWriteComment('')
            getComments(postId)

        }
    }
    const addCommentReply = async (username, CommentId) => {
        setReply(`@${ username }:`)
        setParentCommentId(CommentId)
    }

    const handlePostComment = async () => {
        const trimmedComment = writeComment.trim();
        if (trimmedComment === "") {
            toast.error("Comment cannot be empty");
            return;
        }
        if (reply.length <= 0) {
            addComment()
        } else {
            const response = await AxiosWithBaseURLandCredentials.post(`/post/addcomment`, { postId, comment: writeComment, parentCommentId });
            if (response.status === 200) {
                toast.success("Comment Posted")
                setWriteComment('')
                setParentCommentId("")
                setReply("")
                getComments(postId)

            }
        }
    }

    useEffect(() => {
        getComments(postId);
    }, []);
    const handleDeleteComment = async (postId, commentId) => {
        const response = await AxiosWithBaseURLandCredentials.delete(`/post/comment/${ postId }/${ commentId }`, {
            withCredentials: true
        });
        if (response.status === 200) {
            toast.success("Comment Deleted")
            setCommentCount(prevCount => prevCount - 1);
            const response = await AxiosWithBaseURLandCredentials.post(`/post/get-comment-fromPostId`, { postId });
            console.log(response)
            getComments(postId)

        }
        console.log(response)
    }

    const handleClear = () => {
        console.log("clear")
        setWriteComment("")
        setReply("")
    }
    return (
        <div>
            <div className="px-4">
                <div className="pt-0 pb-2 flex items-start text-sm">{commentCount} Comments</div>
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.commentId} className="flex flex-col w-full pt-2">
                            {/* Comment */}
                            <div className="flex justify-between gap-4">
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <Avatar src={comment.picture} size="sm" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs">{comment.username}</span>
                                        <span>{comment.text}</span>
                                        <div className="flex gap-2">
                                            <span className="text-xs opacity-50 hover:cursor-pointer" onClick={() => addCommentReply(comment.username, comment.commentId)}>Reply</span>
                                            {comment.hasReplies && (
                                                <span className="text-xs opacity-50 hover:cursor-pointer" onClick={() => handleGetReplies(comment.commentId)}>Show Replies</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {(postType === "own" || comment.userId === userId) && (
                                    <Button isIconOnly size="sm" onClick={() => handleDeleteComment(postId, comment.commentId)}>
                                        <DeleteIcon />
                                    </Button>
                                )}
                            </div>
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-10 mt-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply._id} className="flex gap-2 mt-2">
                                            <div>
                                                <Avatar src={reply.userId.picture} size="sm" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs">{reply.userId.username}</span>
                                                <span>{reply.userId.text}</span>
                                                <span>{reply.text}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No comments</div>
                )}
            </div>

            {commentCount > 0 && (
                <div className="flex justify-center">
                    <div className="w-full items-start flex ps-4 text-sm opacity-50 pt-2 hover:opacity-100 hover:cursor-pointer">See All Comments</div>
                </div>
            )}
            <CardFooter className="pt-0">
                <div className="flex flex-row items-end w-full gap-2">
                    <Input startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-xs">{reply}</span>
                        </div>
                    } isClearable type="email" variant="underlined" label="Add a comment" value={writeComment} onChange={(event) => setWriteComment(event.target.value)} onClear={handleClear} />
                    <Button size="sm" onClick={() => handlePostComment()}> Post </Button>
                </div>
            </CardFooter>

        </div>
    );
}

export default Comments;
