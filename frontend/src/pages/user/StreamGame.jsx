import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'

import io from 'socket.io-client';
import VideoPlayer from '../../components/user/gaming/VideoPlayer';

const socket = io('http://localhost:8000'); // Adjust URL to match your server

function StreamGame() {
    const currentUser = useSelector(state => state.auth.id)
    console.log(currentUser)
    const streamKey = "900d56c351b095274746c936360fe143";
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    console.log("Current chat state:", chat);

    useEffect(() => {
        socket.emit('join room', streamKey);

        socket.on('chat message', (msg) => {
            setChat(prev => [...prev, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, [streamKey, currentUser]);

    const sendMessage = () => {
        if (message) {
            socket.emit('chat message', { msg: message, room: streamKey, senderId: currentUser });
            setMessage('');
        }
    };

    return (
        <div className='grid grid-cols-12'>
            <div className='col-span-9 rounded-lg p-2 m-2 border-1 border-white max-h-[90vh]'>
                <VideoPlayer />
            </div>
            <div className='col-span-3 border-1 border-white m-2 rounded-lg max-h-[90vh]'>
                <div className='bg-secondary-400 rounded-t-lg text-lg py-2 flex justify-between px-4'>
                    <span>Live Chat</span>
                    <span>Zing Balance : 0</span>
                </div>
                <ul>
                    {chat.map((msg, index) => (
                        <li key={index} style={{ textAlign: 'left' }}>
                            {msg}  
                        </li>
                    ))}
                </ul>

                <input value={message} onChange={e => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default StreamGame;
