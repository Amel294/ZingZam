import GamesStreamed from "../../../components/user/gaming/GamesStreamedCard";
import { Card, Button, User, CardHeader, Divider } from "@nextui-org/react";

function Stream() {
  const friends = [{
    name: "Amel",
    username: "amelk",
    picture: "https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    avatar_url: "https://avatars.githubusercontent.com/u/58157954?v=4"
  }, {
    name: "Amel",
    username: "amelk",
    picture: "https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    status: false
  }]
  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-3  hidden md:block sticky top-12 left-0 h-screen">
        <div className='flex flex-col items-center w-full gap-4  pt-4 justify-center'>
          <Card className="w-[400px] bg-transparent shadow-none" shadow="none" >
            <div className="flex  justify-between items-center px-3">
              <p className="text-lg text-left  py-3 bold">Friends Streaming</p>
              <p className="text-sm text-secondary-400">see all</p>
            </div>
            <Divider />
            {friends.map((friend) => (
              <>
                <CardHeader className="flex justify-between items-center">
                  <div onClick={() => navigate(`/profile/${ friend.username }`)} className="cursor-pointer">
                    <User
                      name={friend.name}
                      description={friend.username}
                      avatarProps={{
                        src: friend.picture === "" ? friend.picture : `${ friend.name }`,
                      }}

                    />
                  </div>
                  <div className="flex gap-2">
                    
                    <Button size="sm" className="bg-secondary-400 ">
                      Watch Now
                    </Button>
                  </div>
                </CardHeader>
              </>
            ))}
          </Card>

        </div>
      </div>
      <div className="col-span-12 flex flex-col md:col-span-9">
        <div className="text-3xl py-6">Live Streams</div>
        <div className="flex items-center justify-center md:justify-normal md:flex md:flex-col md:overflow-y-auto h-auto">
          <div className="flex flex-wrap justify-center  gap-4 pb-6">
            {[...Array(60)].map((_, index) => (
              <GamesStreamed key={index} fill="white" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stream;
