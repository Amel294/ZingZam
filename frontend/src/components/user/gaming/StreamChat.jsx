import { useDispatch, useSelector } from "react-redux";
import ZingCoinsIcon from "../../../../public/icons/ZingCoinsIcon";
import { Button, Input, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { updateCoins } from "../../../store/auth/authSlice";

const socket = io('http://localhost:8000'); // Adjust URL to match your server

function StreamChat({ handleCoinModelOpen, streamKey }) {
    const coinBalance = useSelector(state => state.auth.coin);
    const currentUser = useSelector(state => state.auth.id);
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const getCoinBalance = await AxiosWithBaseURLandCredentials.get('pay/zinc-balance');
                dispatch(updateCoins({ coin: getCoinBalance.data.coinBalance }));
            } catch (error) {
                console.error("Error fetching coin balance:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        socket.emit('join room', streamKey);

        socket.on('chat message', (msg) => {
            setChat(prev => [...prev, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, [streamKey, currentUser]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (message) {
            socket.emit('chat message', { msg: message, room: streamKey, senderId: currentUser });
            setMessage('');
        }
    };

    return (
        <div className=' border border-white m-2 rounded-lg max-h-[90vh] flex flex-col h-full'>
            <div className='bg-secondary-400 rounded-t-lg text-lg py-2 flex justify-between px-4 items-center'>
                <span>Live Chat</span>
                <span className='flex items-center'>
                    <div className='flex gap-2 items-center'>
                        <ZingCoinsIcon />: {coinBalance}
                        <Button variant='flat' size='sm' auto onClick={handleCoinModelOpen}>Buy Coins</Button>
                    </div>
                </span>
            </div>
            <div className="bg-black py-1"></div>
            <div className='flex-grow overflow-y-scroll p-3'>
                {loading ? <div className='flex justify-center items-center h-full'><CircularProgress size="xl" color="primary" /></div> : (
                    <ul>
                        {chat.map((msg, index) => (
                            <li key={index} className='bg-secondary-400 rounded-lg p-1 m-1 break-words max-w-[80%] self-start text-left ps-2'>
                                {msg}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='flex items-center p-2 gap-2'>
                <Input underlined clearable value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message here" fullWidth />
                <Button auto flat color="primary" onClick={sendMessage}>Send</Button>
            </div>
        </div>
    )
}

export default StreamChat;
