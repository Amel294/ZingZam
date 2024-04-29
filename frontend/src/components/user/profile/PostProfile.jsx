import { useSelector, useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import GridPost from "./GridPost";
import { fetchUserPostsFailure, fetchUserPostsStart, fetchUserPostsSuccess, resetUserPosts } from "../../../store/auth/userPostsSlice";

function PostProfile() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const userPosts = useSelector((state) => state.userPosts.userPosts);
    const userId = useSelector((state) => state.auth.id).toString()
    const { username } = useParams();
    useEffect(()=>{
        dispatch(resetUserPosts())
    },[])
    const fetchPosts = async () => {
        try {
            dispatch(fetchUserPostsStart());
            const response = await AxiosWithBaseURLandCredentials.get(`post/get-profile-posts/${ username }/${ page }`);
            if (response.data.error) {
                toast.error(`${ response.data.error }`);
                
                dispatch(fetchUserPostsFailure(response.data.error));
            } else {
                const newPosts = response.data || [];
                dispatch(fetchUserPostsSuccess(newPosts));
                setPage(page + 1);
                setHasMore(newPosts.length > 0);
            }
        } catch (error) {
            console.error(error);
            toast.error("This didn't work. Check the console for more details.");
            dispatch(fetchUserPostsFailure("Failed to fetch posts"));
        }
    };

    useEffect(() => {
        fetchPosts()
    }, []);

    return (
        <>
            {userPosts.length === 0 && <div>No posts here</div>}
            <div className="flex justify-center flex-col items-center">
                <InfiniteScroll
                    dataLength={userPosts.length}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p className="text-xl py-4">
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {userPosts.length > 0 ? (

                        <GridPost userPosts={userPosts} />

                    ) : null}
                </InfiniteScroll>
            </div>
        </>
    )
}

export default PostProfile;
