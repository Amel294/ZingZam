import { Card, CardBody, CardFooter, Image } from "@nextui-org/react"

function GridPost({ userPosts }) {
    return (
        <div className=" grid grid-cols-2 sm:grid-cols-3 min-w-[400px] justify-between max-w-[400px] gap-2">
            {userPosts.map((post) => (
                <div key={post._id} >
                    <img
                        className="col-span-1 flex items-center  object-cover rounded-lg size-[130px] scale-95 hover:scale-100 transition-transform duration-300"
                        src={post.imageUrl}
                        height={10}
                    />
                </div>

            ))}
        </div>
    )
}

export default GridPost
