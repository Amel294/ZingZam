import { Card, Button, User, Link, CardHeader, Divider } from "@nextui-org/react";

function Friends({ friends }) {
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
                                    <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
                                        @{friend.username}
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
