import { Card, Button, User, CardHeader, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import toast from "react-hot-toast";

function Friends() {
    const [friends, setFriends] = useState([]);
    const [page,setPage] = useState(1)
    const fetchFriends = async ()=>{
        const response = await AxiosWithBaseURLandCredentials.get(`/connections/friends/${username}/${page}`)
        if(response.status === 200){
            console.log(response.data)
            setFriends(response.data)
            setPage(page+1)
        }else{
            toast.error(response.data.message)
        }
    }
    const { username } = useParams();

    useEffect(()=>{
        fetchFriends()
    },[username])
    const navigate = useNavigate();
    return (
        <>
        {friends &&
        <div className='flex flex-col items-center w-full gap-4 pt-4 justify-center'>
            <Card className="w-[400px]">
                <div className="flex  justify-between items-center px-3">
                    <p className="text-lg text-left  py-3 bold">{friends.length === 1 ? '1 Friend' : `${ friends.length } Friends`} </p>
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
                            <Button size="sm" >
                                Unfriend
                            </Button>
                        </CardHeader>
                    </>
                ))}
            </Card>

        </div>
    }
            </>
    )
}

export default Friends
