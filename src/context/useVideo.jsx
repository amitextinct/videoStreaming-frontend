import { useContext } from 'react';
import VideoContext from './videoContext';

const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export default useVideo;
