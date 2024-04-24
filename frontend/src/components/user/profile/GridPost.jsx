import { Card, CardBody, CardFooter, Image } from "@nextui-org/react"

function GridPost({ userPosts }) {
    return (
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-3 max-w-[400px]">
            {userPosts.map((post) => (
                <Card
                    shadow="sm"
                    key={post._id}
                    isPressable
                    onPress={() => console.log("item pressed")}
                    fullWidth="false"
                >
                    <CardBody className="overflow-visible p-0">
                        <Image
                            className="object-cover"
                            src={post.imageUrl}
                            width="100%"
                            height="100%"
                            isZoomed
                        />
                    </CardBody>
                    <CardFooter className="text-small justify-between overflow-hidden">
                        <b>{post.caption}</b>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default GridPost
