import { Card, Divider } from "@nextui-org/react";
import { useEffect, useState, } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RequestedFriendsUsers from "./RequestedFriendsUsers";

function RequestedFriends() {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/connections/requests`, { withCredentials: true });
                console.log("request send");
                if (response.data.error) {
                    toast.error(`${ response.data.error }`);
                } else {
                    setRequests(response.data.requests); 
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        fetchRequests();
    }, []);

    return (
        <Card className="w-[300px]">
            <div className="flex flex-col">
                <p className="text-lg text-left ps-3 py-3 bold">Requests</p>
            </div>
            <Divider />
            {requests &&
                <RequestedFriendsUsers requests={requests} />}
        </Card>
    )
}

export default RequestedFriends
