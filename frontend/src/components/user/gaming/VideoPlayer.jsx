import { useState } from 'react';
import { ReactFlvPlayer } from 'react-flv-player';

const VideoPlayer = ({streamKey}) => {
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 3;

  const handlePlayerError = (err) => {
    switch (err) {
      case 'NetworkError':
      case 'MediaError':
        if (reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts(reconnectAttempts + 1);
        } else {
          console.log('Max reconnect attempts reached');
        }
        break;
      default:
        console.log('Other error');
    }
  };

  return (
    <div className='w-full h-auto rounded-lg'>
      <ReactFlvPlayer
        type="flv"
        url={`http://localhost:7000/live/${streamKey}.flv`}
        isLive={true}
        isMuted={true}
        enableStashBuffer={false}
        handleError={handlePlayerError}
        enableError={true}
        reconnectInterval={5000}
        autoPlay={true}
        key={reconnectAttempts} 
      />
    </div>
  );
};

export default VideoPlayer;
