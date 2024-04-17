import { Button, User, Link, CardHeader } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AxiosWithBaseURLandCredentials from "../../../../axiosInterceptor";

function SuggestedFriendsUsers({ suggestions }) {
    const [isLoading, setIsLoading] = useState(false)
    const handleRequest = async (friendsId) => {
        try {
            setIsLoading(true)
            const response = await AxiosWithBaseURLandCredentials.post(
                `/connections/sendrequest`,
                { receiverId:friendsId }            );
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
            {suggestions.map((user) => (
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
                    <Button size="sm" onClick={() => handleRequest(user._id)} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Send Request"}
                    </Button>

                </CardHeader>
            ))}
        </div>
        </>
    )
}

export default SuggestedFriendsUsers
