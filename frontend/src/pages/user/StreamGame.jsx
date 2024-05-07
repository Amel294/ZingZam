import React from 'react'
import VideoPlayer from '../../components/user/gaming/VideoPlayer'

function StreamGame() {
    return (
        <div className='grid grid-cols-12 '>
            <div className='col-span-9 rounded-lg p-2 m-2 border-1 border-white max-h-[90vh]'>
                <VideoPlayer />

            </div>
            <div className='col-span-3 border-1 border-white  m-2 rounded-lg max-h-[90vh]'>
                    <div className='bg-secondary-400 rounded-t-lg text-lg py-2 flex justify-between px-4'>
                        <span>Live Chat</span>
                        <span>Zing Balance : 0</span>

                    </div>
            </div>
           
        </div>
    )
}

export default StreamGame
