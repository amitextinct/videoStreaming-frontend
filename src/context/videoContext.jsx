import { createContext, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { getChannel } from '../services/Services';

const VideoContext = createContext();

function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [totalPages, setTotalPages] = useState(0); // Add totalPages state
  const cachedPagesRef = useRef({});

  const updateOwnerDetails = useCallback((username, details) => {
    setOwnerDetails(prev => ({
      ...prev,
      [username]: details
    }));
  }, []);

  const fetchOwnerDetails = useCallback(async (username) => {
    try {
      const response = await getChannel(username);
      if (response.success) {
        updateOwnerDetails(username, response.data);
      }
    } catch (error) {
      console.error('Error fetching channel details:', error);
    }
  }, [updateOwnerDetails]);

  const getCachedVideos = useCallback((page) => {
    const cachedData = cachedPagesRef.current[page];
    if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
      return {
        videos: cachedData.videos,
        totalPages: cachedData.totalPages
      };
    }
    return null;
  }, []);

  const updateVideos = useCallback((newVideos, page, newTotalPages) => {
    setVideos(newVideos);
    setTotalPages(newTotalPages); // Update total pages
    cachedPagesRef.current[page] = {
      videos: newVideos,
      totalPages: newTotalPages,
      timestamp: Date.now()
    };
    
    // Fetch owner details for each video
    newVideos.forEach(video => {
      if (video.owner?.username && !ownerDetails[video.owner.username]) {
        fetchOwnerDetails(video.owner.username);
      }
    });
  }, [ownerDetails, fetchOwnerDetails]);

  const value = {
    videos,
    updateVideos,
    ownerDetails,
    updateOwnerDetails,
    getCachedVideos,
    fetchOwnerDetails,
    totalPages // Add totalPages to context value
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

VideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { VideoProvider };
export default VideoContext;
