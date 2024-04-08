import { Card,  Button, User, Link, CardHeader,  Divider } from "@nextui-org/react";

function Followers() {
    return (
        <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center'>
                <Card className="w-[400px]">
                    <div className="flex flex-col">
                        <p className="text-lg text-left ps-3 py-3 bold">110 Followers</p>
                    </div>
                    <Divider/>
                    <CardHeader className="flex justify-between">
                        <User
                            name="Junior Garcia"
                            description={(
                                <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
                                    @jrgarciadev
                                </Link>
                            )}
                            avatarProps={{
                                src: "https://avatars.githubusercontent.com/u/30373425?v=4"
                            }}
                        />
                        <Button size="sm">
                            Small
                        </Button>
                    </CardHeader>
                </Card>

            </div>
    )
}

export default Followers
