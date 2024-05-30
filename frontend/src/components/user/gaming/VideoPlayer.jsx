import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import './style.css';
import PlayIcon from '../../../../public/icons/PlayIcon';

const VideoPlayer = ({ streamKey }) => {
  const [isBuffering, setIsBuffering] = useState(false);

  const playerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  const controlsStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '5px',
    padding: '10px',
  };

  const controlButtonStyle = {
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <div className='video-player-container hover:cursor-pointer' style={playerStyle}>
      {isBuffering && <div className="buffering">Loading...</div>}
      <ReactPlayer
        url={`${import.meta.env.VITE_BASE_URL_STREAM}/live/${streamKey}.flv`}
        playing
        controls
        width='100%'
        height='100%'
        style={controlsStyle}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        onError={(e) => console.log('Error:', e)}
        pip = {true}
        muted={false}
        config={{
          file: { forceFLV: true },
        }}
        controlsList="nodownload"
        light={true}
        playIcon={<button className=' p-4 rounded-full' style={controlButtonStyle}><PlayIcon className='opacity-50 hover:opacity-100'/></button>}
      />
    </div>
  );
};

export default VideoPlayer;
