import { Card} from "@nextui-org/react";
import { useEffect, useState, } from "react";
import toast from "react-hot-toast";
import RequestSendUsers from "./RequestSendUsers";
import AxiosWithBaseURLandCredentials from "../../../../../axiosInterceptor";

function RequestSend() {
    const [requestsSend, setRequestsSend] = useState([])
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await AxiosWithBaseURLandCredentials.get(`/connections/getrequestsend`);
                if (response.data.error) {
                    toast.error(`${ response.data.error }`);
                
                } 
                else if(!response?.data?.requestsSend || response?.data?.requestsSend === undefined || response?.data?.requestsSend?.length === 0){
                    //no requests
                }
                else {
                    setRequestsSend(response.data.requestsSend); 
                }
            } catch (error) {
                console.error("Error fetching requests:", error?.response?.data?.message);
            }
        };

        fetchRequests();
    }, []);

    return (
        <Card className="w-[300px]">
            <div className="flex flex-col">
                <p className="text-md text-left ps-3 py-3 bold bg-secondary-400">Requests Send</p>
            </div>
            {requestsSend &&
                <RequestSendUsers requestsSend={requestsSend} />}
        </Card>
    )
}

export default RequestSend
