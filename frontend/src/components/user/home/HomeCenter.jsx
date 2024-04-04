import AddPost from "../postComponents/AddPost"
import Post from "../postComponents/Post"

function HomeCenter() {
  return (
    <div className="flex justify-center flex-col items-center gap-4 pt-4">
      <AddPost/>
      <Post/>
      <Post/>
      <Post/>
      <Post/>
      <Post/>
      <Post/>
      <Post/>
      <Post/>
      <Post/>
    </div>
  )
}

export default HomeCenter
