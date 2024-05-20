import { useEffect, useState } from "react";
import GamesStreamedCard from "../../../components/user/gaming/GamesStreamedCard";
import { Card, Button, User, CardHeader, Divider } from "@nextui-org/react";
import ServerAndKeyModel from "./ServerAndKeyModel";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { useNavigate } from "react-router-dom";

function Stream() {
  const [streams, setStreams] = useState([]);
  const [friends, setFriends] = useState([]);

  const [isServerAndKeyModelOpen, setIsServerAndKeyModelOpen] = useState(false);
  const handleServerAndKeyModel = () => {
    setIsServerAndKeyModelOpen(true);
  };

  const fetchActiveStreams = async () => {
    try {
      const response = await AxiosWithBaseURLandCredentials.get('/stream/activeStreams');
      setStreams(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchActiveFriendsStreams = async () => {
    try {
      const response = await AxiosWithBaseURLandCredentials.get('/stream/activeFriendsStreams');
      setFriends(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchActiveStreams();
    fetchActiveFriendsStreams();
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <ServerAndKeyModel isServerAndKeyModelOpen={isServerAndKeyModelOpen} setIsServerAndKeyModelOpen={setIsServerAndKeyModelOpen} />
      <div className="grid grid-cols-12 min-h-screen">
        <div className="col-span-3 hidden md:block sticky top-12 left-0 h-screen">
          <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center'>
            <Card className="w-[400px] bg-transparent shadow-none">
              <div className="flex justify-between items-center px-3">
                <p className="text-lg text-left py-3 bold">Friends Streaming</p>
                <p className="text-sm text-secondary-400 cursor-pointer">see all</p>
              </div>
              <Divider />
              {friends.length > 0 ? (
                friends.map((friendStream) => (
                  <div key={friendStream._id}>
                    <CardHeader className="flex justify-between items-center">
                      <div onClick={() => navigate(`/profile/${ friendStream.userId.username }`)} className="cursor-pointer">
                        <User
                          name={friendStream.userId.name}
                          description={friendStream.userId.username}
                          avatarProps={{
                            src: friendStream.userId.picture || "default-avatar.png",
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-secondary-400" onClick={() => navigate(`/streamgame/${ friendStream.streamKey }`)}>
                          Watch Now
                        </Button>
                      </div>
                    </CardHeader>
                    <Divider />
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No friends streaming</p>
              )}
            </Card>
          </div>
        </div>
        <div className="col-span-12 flex flex-col md:col-span-9">
          <div className="flex justify-between px-24 items-center">
            <div className="text-3xl py-6">Live Streams</div>
            <Button variant="solid" className="bg-secondary-400" onClick={handleServerAndKeyModel}>
              Start Streaming
            </Button>
          </div>
          <div className="flex items-center justify-center md:justify-normal md:flex md:flex-col md:overflow-y-auto h-auto">
            <div className="flex flex-wrap justify-center gap-4 pb-6">
              {streams.length > 0 ? (
                streams.map((stream) => (
                  <>
                    <GamesStreamedCard key={stream._id} stream={stream} />
                  </>
                ))
              ) : (
                <p>No active streams</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Stream;
