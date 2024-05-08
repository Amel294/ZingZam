import ReactPlayer from 'react-player';

const VideoPlayer = ({streamKey}) => {
    return (
      <div className='w-full h-full'>
        <ReactPlayer 
          url={`http://localhost:7000/live/${streamKey}.flv` }
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
