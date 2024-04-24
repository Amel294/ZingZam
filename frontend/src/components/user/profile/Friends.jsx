import { Card, Button, User, Link, CardHeader, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

function Friends({ friends }) {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center'>
            <Card className="w-[400px]">
                <div className="flex  justify-between items-center px-3">
                    <p className="text-lg text-left  py-3 bold">{friends.length === 1 ? '1 Friend' : `${ friends.length } Friends`} </p>
                    <p className="text-sm text-secondary-400">see all</p>
                </div>
                <Divider />
                {friends.map((friend) => (
                    <>

                        <CardHeader className="flex justify-between">
                            <User
                                name={friend.name}
                                description={(
                                    <Link navigate={`http://localhost:5173/profile/${friend.username}`} size="sm" isExternal>
                                        {friend.username}
                                    </Link>
                                )}
                                avatarProps={{
                                    src: friend.picture === "" ? friend.picture : `${friend.name}`,
                                }}
                            />
                            <Button size="sm" >
                                Unfriend
                            </Button>
                        </CardHeader>
                    </>
                ))}
            </Card>

        </div>
    )
}

export default Friends
