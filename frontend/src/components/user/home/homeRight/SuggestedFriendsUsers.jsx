import { Button, User, Link, CardHeader } from "@nextui-org/react";

function SuggestedFriendsUsers({ suggestions }) {
    if (!Array.isArray(suggestions)) {
        return <div>No suggestions available</div>;
    }

    return (
        <div>
            {suggestions.map((user) => (
                <CardHeader key={user._id} className="flex justify-between">
                    <User
                        name={user.name}
                        description={(
                            <Link href={`https://twitter.com/${user.username}`} size="sm" isExternal>
                                {user.name}
                            </Link>
                        )}
                        avatarProps={{
                            src: user.picture || "https://via.placeholder.com/150" // Placeholder image URL
                        }}
                    />
                    <Button size="sm" onClick={() => alert("Add friend clicked")}>
                        Follow
                    </Button>
                </CardHeader>
            ))}
        </div>
    );
}

export default SuggestedFriendsUsers;
