import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import GridPost from "./GridPost";

function SavedPosts() {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const { username } = useParams();

    const fetchPosts = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/post/get-saved-posts/${page}`);
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                const newPosts = response.data.posts || [];
                setUserPosts((prev) => [...prev, ...newPosts]);
                setPage((prev) => prev + 1);
                setHasMore(response.data.hasMore);
            }
        } catch (error) {
            console.error(error);
            toast.error("This didn't work. Check the console for more details.");
        }
    };

    useEffect(() => {
        setPage(1)
        fetchPosts();

    }, []);

    return (
        <>
            {userPosts.length === 0 && <div>No saved posts here</div>}
            <div className="flex justify-center flex-col items-center">
                {userPosts.length > 0 && <GridPost userPosts={userPosts} />}
                {hasMore && (
                    <utton
                        onClick={fetchPosts}
                        className="mt-4 px-4 py-2 bg-secondary-400 text-white rounded-lg"
                    >
                        Load More
                    </utton>
                )}
                {!hasMore && userPosts.length > 0 && (
                    <p className="text-xl py-4">
                        <b>Yay! You have seen it all</b>
                    </p>
                )}
            </div>
        </>
    );
}

export default SavedPosts;
