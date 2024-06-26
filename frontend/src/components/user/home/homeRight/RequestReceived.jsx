import { Card } from "@nextui-org/react";
import { useEffect, useState, } from "react";
import toast from "react-hot-toast";
import RequestReceivedUsers from "./RequestReceivedUsers";
import AxiosWithBaseURLandCredentials from "../../../../axiosInterceptor";

function RequestReceived() {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await AxiosWithBaseURLandCredentials.get(`/connections/getrequestsreceived`);
                if (response.data.error) {
                    //Do nouthing
                }
                else if(!response?.data || response?.data?.length === 0){
                    console.log("No requests received");
                } else {
                    setRequests(response.data.requestsReceived);
                }
            } catch (error) {
                console.log(error);
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
