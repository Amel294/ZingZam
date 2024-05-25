import { useEffect, useState } from 'react';
import VideoPlayer from '../../components/user/gaming/VideoPlayer';
import CoinModal from '../../components/user/zincCoins/CoinModal';
import StreamChat from '../../components/user/gaming/StreamChat';
import { useParams } from 'react-router-dom';
import AxiosWithBaseURLandCredentials from '../../axiosInterceptor';
import { Spinner } from '@nextui-org/react';
import NotFound from './NotFound';

function StreamGame() {
    const [streamStatus, setStreamStatus] = useState('notfound');
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const streamKey = params.streamkey;
    const [streamUserId, setStreamUserId] = useState();
    const [isCoinModelOpen, setIsCoinModelOpen] = useState(false);

    const handleCoinModelOpen = () => {
        setIsCoinModelOpen(true);
    };
    
    const fetchStreamStatus = async () => {
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`/stream/streamStatus/${streamKey}`);
            setStreamStatus(response.data.status);
            setStreamUserId(response.data.userId);
        } catch (error) {
            console.error('Error fetching stream status:', error);
            setStreamStatus('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreamStatus();
    }, [streamKey])

    return (
        <>
            {loading ? (
                <Spinner className='h-screen' />
            ) : streamStatus === 'notfound' ? (
                <NotFound />
            ) : streamStatus === 'inactive' ? (
                <div className=' h-screen flex justify-center items-center text-4xl'><span>User has ended or not started the stream</span></div>
            ) : (
                <div className='h-screen'>
                    <div className='grid grid-cols-12'>
                        <div className='col-span-12 lg:col-span-9 rounded-lg p-2 m-2 border-white flex gap-2 border-1 aspect-video items-center'>
                            <VideoPlayer streamKey={streamKey} className='w-full' />
                        </div>
                        <div className='col-span-12 lg:col-span-3 w-full pb-4 max-h-[89.7vh]'>
                            <StreamChat handleCoinModelOpen={handleCoinModelOpen} streamKey={streamKey}  streamUserId={streamUserId}/>
                        </div>
                    </div>
                    <CoinModal isCoinModelOpen={isCoinModelOpen} setIsCoinModelOpen={setIsCoinModelOpen} onClick={handleCoinModelOpen} />
                </div>
            )}
        </>
    );
}

export default StreamGame;
