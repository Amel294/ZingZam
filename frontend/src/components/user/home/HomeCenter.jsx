import { useEffect, useState } from "react";
import AddPost from "../postComponents/AddPost";
import Post from "../postComponents/Post";
import toast from "react-hot-toast";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsFailure, fetchPostsStart, fetchPostsSuccess } from "../../../store/auth/postsSlice";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";

function HomeCenter() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.id)
  useEffect(() => {
    fetchPosts()
  }, [])
  const fetchPosts = async () => {
    try {
      dispatch(fetchPostsStart());
      const response = await AxiosWithBaseURLandCredentials.get(`/post/get-posts/${ page }`);
      if (response.data.error) {
        toast.error(`${ response.data.error }`);
        dispatch(fetchPostsFailure(response.data.error));
      } else {
        console.log(response.data)
        const newPosts = response.data || [];
        dispatch(fetchPostsSuccess(newPosts));
        setPage(page + 1);
        setHasMore(newPosts.length > 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("This didn't work. Check the console for more details.");
      dispatch(fetchPostsFailure("Failed to fetch posts"));
    }

  };
  return (
    <div className="flex  flex-col items-center gap-4 pt-4 min-h-screen">
      <AddPost />
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
        {console.log(posts.length)}
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="mb-4">
              <Post post={post} userId={userId} />

            </div>
          ))
        ) : null}
      </InfiniteScroll>
    </div>
  );
}

export default HomeCenter;
