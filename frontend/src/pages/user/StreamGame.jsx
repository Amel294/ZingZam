import { useState } from 'react';
import VideoPlayer from '../../components/user/gaming/VideoPlayer';
import CoinModal from '../../components/user/zincCoins/CoinModal';
import StreamChat from '../../components/user/gaming/StreamChat';

function StreamGame() {
    const [isCoinModelOpen, setIsCoinModelOpen] = useState(false);
    const handleCoinModelOpen = () => {
        setIsCoinModelOpen(true);
    };
    const streamKey = "d442a8ef46ad30adfae2d42df5e136a3";
    return (
        <>
            <div className='h-screen'>
                <div className='grid grid-cols-12  '>
                    <div className='col-span-12 lg:col-span-9 rounded-lg p-2 m-2  border-white flex gap-2 border-1  aspect-video items-center '>
                        <VideoPlayer streamKey={streamKey} className='w-full' />
                    </div>
                    <div className='col-span-12 lg:col-span-3 w-full pb-4 max-h-[89.7vh]' >
                        <StreamChat handleCoinModelOpen={handleCoinModelOpen} streamKey={streamKey} />
                    </div>
                </div>
                <CoinModal isCoinModelOpen={isCoinModelOpen} setIsCoinModelOpen={setIsCoinModelOpen} onClick={handleCoinModelOpen} />
            </div>
        </>
    );

}

export default StreamGame;
