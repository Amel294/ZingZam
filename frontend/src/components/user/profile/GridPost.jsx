import PostPopUpModel from "./PostPopUpModel"
import { useState } from "react";

function GridPost({ userPosts }) {
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [postId, setPostId] = useState(null)
    const handleClose = () => {
        setIsPostOpen(false);
    };
    const handleSetPostAndPostId = (postId) => {
        setIsPostOpen(true)
        setPostId(postId)
    }
    return (
        <>
            <div className=" grid grid-cols-3 min-w-[400px] justify-between max-w-[400px] gap-2">
                {userPosts.map((post) => (
                    <div key={post._id} >
                        <img
                            className="col-span-1 flex items-center  object-cover rounded-lg size-[130px] scale-95 hover:scale-100 transition-transform duration-300"
                            src={post.imageUrl}
                            height={10}
                            onClick={()=>handleSetPostAndPostId(post?._id)}
                        />
                    </div>

                ))}
            </div>
            <PostPopUpModel handleClose={handleClose} setIsPostOpen={setIsPostOpen} isPostOpen={isPostOpen} postId={postId} />

        </>
    )
}

export default GridPost
