import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";

function StreamProfile() {
    const [page, setPage] = useState(1);
    const [streamData, setStreamData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { username } = useParams();
    
    async function fetchStreams() {
        try {
            setLoading(true);
            const response = await AxiosWithBaseURLandCredentials.get(`/stream/userStreams/${username}/${page}`);
            if (response.status === 200) {
                const { streams, hasMore } = response.data;
                if (Array.isArray(streams)) {
                    setStreamData(prev => [...prev, ...streams]);
                    setPage(prev => prev + 1);
                    setHasMore(hasMore);
                } else {
                    console.log("Unexpected response structure:", response.data);
                }
            } else {
                console.log("Unexpected response:", response);
            }
        } catch (error) {
            console.log("Error fetching streams:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStreams();
    }, [username]);

    return (
        <div className="w-full max-w-[400px]">
        {streamData &&
            <Accordion variant="bordered" className="w-full">
                {streamData.map((stream, index) => (
                    <AccordionItem key={index} aria-label={`Stream ${index + 1}`} title={stream.title}>
                        <div className="text-left">
                            <p><strong className="text-secondary-400">Start Time:</strong> {new Date(stream.startTime).toLocaleString()}</p>
                            <p><strong className="text-secondary-400">End Time:</strong> {stream.endTime ? new Date(stream.endTime).toLocaleString() : 'Live'}</p>
                            <p><strong className="text-secondary-400">Contributions Received:</strong> {stream.contributionsReceived}</p>
                            <p><strong className="text-secondary-400">Top 3 Contributors</strong></p>
                            <ul>
                                {stream.topContributors.map((contributor, idx) => (
                                    <li key={idx}>
                                        {contributor.username}: {contributor.coins} Zing Coins
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
        }
            {hasMore && (
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={fetchStreams}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default StreamProfile;
