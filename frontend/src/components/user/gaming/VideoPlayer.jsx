import ReactPlayer from 'react-player';

const VideoPlayer = () => {
    return (
      <div className='w-full h-full'>
        <ReactPlayer 
          url='http://localhost:7000/live/900d56c351b095274746c936360fe143.flv' 
          playing={true} 
          muted={true} 
          controls
          width='100%'
          height='100%'
        />

      </div>
    );
};

export default VideoPlayer;
