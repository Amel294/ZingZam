import { Button, User, Link, CardHeader } from "@nextui-org/react";
import axios from 'axios'
import { useState } from "react";
import toast from "react-hot-toast";

function RequestSendUsers({ requestsSend }) {
    const [isLoading, setIsLoading] = useState(false)
    const handleRequestResponse = async (userId,isAccept) => {
        try {
            setIsLoading(true)
            const response = await axios.delete(
                `http://localhost:8000/connections/deleterequest/${userId}`,
                { withCredentials: true } 
            );
            if (response.data.error) {
                toast.error(response.data.error);
                setIsLoading(false)
            } else {
                toast.success(response.data.message);
                setIsLoading(false)
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div>
                {requestsSend.map((user) => (
                    <CardHeader key={user._id} className="flex justify-between">
                        <User
                            name={user.name}
                            description={(
                                <Link href={`https://twitter.com/${ user.username }`} size="sm" isExternal>
                                    {user.name}
                                </Link>
                            )}
                            avatarProps={{
                                src: user.picture || "https://via.placeholder.com/150" // Placeholder image URL
                            }}
                        />
                        <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleRequestResponse(user._id,"decline")} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Cancel Request"}
                        </Button>
                        </div>

                    </CardHeader>
                ))}
            </div>
        </>
    )
}

export default RequestSendUsers
