import { Card } from "@nextui-org/react";
import { useEffect, useState, } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RequestReceivedUsers from "./RequestReceivedUsers";

function RequestReceived() {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/connections/getrequestsreceived`, { withCredentials: true });
                console.log("request send");
                if (response.data.error) {
                    toast.error(`${ response.data.error }`);
                } else {
                    setRequests(response.data.requestsReceived);
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
                <p className="text-md text-left ps-3 py-3 bold bg-secondary-400">Requests Received</p>
            </div>
            {requests &&
                <RequestReceivedUsers requests={requests} />}
        </Card>
    )
}

export default RequestReceived
