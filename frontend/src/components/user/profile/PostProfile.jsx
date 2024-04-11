import { fetchPostsFailure, fetchPostsStart, fetchPostsSuccess } from "../../../store/auth/postsSlice";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from "../postComponents/Post";
import { useParams } from 'react-router-dom';

function PostProfile() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const posts = useSelector((state) => state.posts.posts); 
    const userId = useSelector((state) => state.auth.id).toString()
    const { username } = useParams();
    console.log(username);
    const fetchPosts = async () => {
        try {
            dispatch(fetchPostsStart());
            const response = await axios.get(`http://localhost:8000/post/get-profile-posts/${username}/${ page }`, { withCredentials: true });
            if (response.data.error) {
                toast.error(`${ response.data.error }`);
                dispatch(fetchPostsFailure(response.data.error)); // Pass error message to failure action
            } else {
                const newPosts = response.data.posts || [];
                dispatch(fetchPostsSuccess(newPosts));
                setPage(page + 1);
                setHasMore(newPosts.length > 0);
            }
        } catch (error) {
            console.error(error);
            toast.error("This didn't work. Check the console for more details.");
            dispatch(fetchPostsFailure("Failed to fetch posts")); // Generic error message
        }
    };
    useEffect(()=>{
        fetchPosts()
    },[])
    return (
        <div className="flex justify-center flex-col items-center   min-h-screen">
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchPosts}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p className="text-xl py-4">
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="mb-4">
                            <Post post={post} userId={userId} />
                        </div>
                    ))
                ) : null}
            </InfiniteScroll>
        </div>
    )
}

export default PostProfile
