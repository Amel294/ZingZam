import { Button, User, Link, CardHeader } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AxiosWithBaseURLandCredentials from "../../../../axiosInterceptor";

function RequestReceivedUsers({ requests }) {
    const [isLoading, setIsLoading] = useState(false)
    const handleRequestResponse = async (userId,isAccept) => {
        try {
            setIsLoading(true)
            const response = await AxiosWithBaseURLandCredentials.post(
                `/connections/requestResponse`,
                { request: userId,isAccept : isAccept === "accept" ? true : false  },
                { withCredentials: true } // Move withCredentials to the third argument
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
        {console.log(requests)}
            <div>
                {requests.map((user) => (
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

                        <Button size="sm" onClick={() => handleRequestResponse(user._id,"accept")} disabled={isLoading}>
                            {isLoading ? "Loading..." : "accept"}
                        </Button>
                        <Button size="sm" onClick={() => handleRequestResponse(user._id,"decline")} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Decline"}
                        </Button>
                        </div>

                    </CardHeader>
                ))}
            </div>
        </>
    )
}

export default RequestReceivedUsers
