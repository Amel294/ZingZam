import { useDispatch, useSelector } from "react-redux";
import ZingCoinsIcon from "../../../../public/icons/ZingCoinsIcon";
import { Button, Input, CircularProgress, Avatar, Accordion, AccordionItem } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client';
import AxiosWithBaseURLandCredentials from "../../../axiosInterceptor";
import { updateCoins } from "../../../store/auth/authSlice";
import SendCoinsModel from "./SendCoinsModel";

const socket = io(`${import.meta.env.VITE_BASE_URL_BACKEND}`);

function StreamChat({ handleCoinModelOpen, streamKey, streamUserId }) {
    const coinBalance = useSelector(state => state.auth.coin);
    const currentUserName = useSelector(state => state.auth.username);
    const currentUser = useSelector(state => state.auth.id);
    const [writeMessage, setWriteMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSendCoinOpen, setIsSendCoinOpen] = useState(false);
    const [giftNotification, setGiftNotification] = useState('');
    const [topSupporters, setTopSupporters] = useState([]);
    const dispatch = useDispatch();
    const chatContainerRef = useRef(null);
    const [isReportModelOpen,setIsReportModelOpen] = useState(false)
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

    const fetchSupports = async () => {
        setLoading(true);
        try {
            const response = await AxiosWithBaseURLandCredentials.get(`stream/support/${streamKey}`);
            setTopSupporters(response.data.support);
        } catch (error) {
            console.error("Error fetching supporters:", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
        fetchSupports();
    }, []);

    useEffect(() => {
        socket.emit('join room', streamKey);
        socket.on('chat message', (msg) => {
            setChat(prev => [...prev, msg]);
        });
        socket.on('gift received', (data) => {
            const { senderId, recipientId, coins, message } = data;
            if (recipientId === currentUser) {
                setGiftNotification(`You received ${ coins } Zing Coins from ${ senderId } with message: ${ message }`);
                dispatch(updateCoins({ coin: coinBalance + coins }));
                fetchSupports();
            }
        });
        return () => {
            socket.off('chat message');
            socket.off('gift received');
        };
    }, [streamKey, coinBalance, currentUser, dispatch]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();

        }
    };

    const sendMessage = () => {
        if (writeMessage) {
            const messageData = { currentUserName: currentUserName, senderId: currentUser, text: writeMessage, room: streamKey };
            socket.emit('chat message', messageData);
            setWriteMessage('');
        }
    };

    const sendGift = async (coins, message) => {
        setLoading(true);
        try {
            const response = await AxiosWithBaseURLandCredentials.post('/stream/support', { coins, message, streamKey });
            if (response.status === 200) {
                fetchSupports();
            } else {
                console.log('Error sending gift');
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    };

    return (
        <>
            <div className='border border-gray-300 m-2 rounded-lg max-h-[90vh] flex flex-col h-full shadow-lg dark'>
                <div className='bg-secondary-400 rounded-t-lg text-lg py-2 flex justify-between px-4 items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white'>
                    <span>Live Chat</span>
                    <span className='flex items-center'>
                        <div className='flex gap-2 items-center'>
                            <ZingCoinsIcon />: {coinBalance}
                            <Button variant='flat' size='sm' auto onClick={handleCoinModelOpen}>Buy Coins</Button>
                        </div>
                    </span>
                </div>
                {giftNotification && (
                    <div className="bg-yellow-500 text-black p-2 rounded-lg my-2 text-center">
                        {giftNotification}
                    </div>
                )}
                <Accordion isCompact='true'>
                    <AccordionItem
                        key="1"
                        aria-label="contributors"
                        title={<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>Top Contributors</div>}
                    >
                        <div className="bg-secondary-400 bg-opacity-35">
                            <ul className="flex flex-wrap justify-center gap-5 p-2">
                                {topSupporters.map((support, index) => (
                                    <li key={index} className="text-white text-center align-top">
                                        <div className="flex flex-col items-center bg-secondary-400 p-2 rounded-lg min-w-24">
                                            <div className="flex justify-center mb-2">
                                                <Avatar src={support.user.avatar} alt={`${ support.user.name }'s avatar`} className="w-8 h-8 rounded-full" />
                                            </div>
                                            <div className="mb-1 text-sm font-medium">{support.user.username}</div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">{support.coins}</span>
                                                <ZingCoinsIcon />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionItem>
                </Accordion>

                <div ref={chatContainerRef} className='flex-grow overflow-y-scroll p-3 bg-black'>
                    {loading ? <div className='flex justify-center items-center h-full'><CircularProgress size="xl" color="primary" /></div> : (
                        <ul className="space-y-2">
                            <li className="text-gray-500 text-center">Welcome to live chat</li>
                            {chat.map((msg, index) => (
                                <div key={index} className={`w-full flex ${ msg.senderId === currentUser ? "justify-end" : "justify-start" }`}>
                                    <div className={`p-2 rounded-lg max-w-[80%] ${ msg.senderId === currentUser ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white' } break-words text-left`}>
                                        <span className="font-medium text-md">{msg.senderId !== currentUser ? `${ msg.currentUserName }: ` : 'You: '}</span>
                                        <span className="whitespace-pre-wrap text-sm">{msg.text}</span>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
                {streamUserId !== currentUser && (
                    <div className="dark text-white flex justify-around py-2">
                        <div className="flex gap-4 items-center">
                            <span className="text-md">Support Streamer:</span>
                            <Button variant="solid" className="bg-secondary-400" size="sm" onClick={() => setIsSendCoinOpen(true)}>
                                Send Coins
                            </Button>
                        </div>
                    </div>
                )}
                <div className='flex items-center p-2 gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg'>
                    <Input
                        underlined
                        clearable
                        value={writeMessage}
                        onChange={e => setWriteMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message here"
                        fullWidth
                        maxLength={150}
                    />
                    <Button auto variant="solid" className="bg-black border-white" onClick={sendMessage}>Send</Button>
                </div>
            </div>
            <SendCoinsModel
                isSendCoinOpen={isSendCoinOpen}
                setIsSendCoinOpen={setIsSendCoinOpen}
                streamKey={streamKey}
                onSendGift={sendGift}
            />

        </>
    );
}

export default StreamChat;
