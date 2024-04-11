import { Card, Divider } from "@nextui-org/react";
import SuggestedFriendsUsers from "./SuggestedFriendsUsers";
import { useEffect, useState, } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function SuggestedFriends() {
    const [suggestions, setSuggestions] = useState([])
    useEffect(() => {
        const fetchSuggestedFriends = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/connections/suggestions`, { withCredentials: true });
                console.log("request send");
                if (response.data.error) {
                    toast.error(`${ response.data.error }`);
                } else {
                    setSuggestions(response.data.suggestions);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        fetchSuggestedFriends();
    }, []);

    return (
        <Card className="w-[300px] ">
            <div className="flex flex-col bg-secondary-400">
                <p className="text-md text-left ps-3 py-3 bold">Suggested Friends</p>
            </div>
            {suggestions &&
                <SuggestedFriendsUsers suggestions={suggestions} />}
        </Card>
    )
}

export default SuggestedFriends
