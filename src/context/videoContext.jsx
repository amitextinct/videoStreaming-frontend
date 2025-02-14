import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getChannel } from '../services/Services';

const VideoContext = createContext();

function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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

  const updateVideos = useCallback((newVideos, page, newTotalPages) => {
    if (page === 1) {
      setVideos(newVideos);
    } else {
      setVideos(prev => [...prev, ...newVideos]);
    }
    setCurrentPage(page);
    setTotalPages(newTotalPages);

    // Fetch owner details for new videos
    newVideos.forEach(video => {
      if (video.owner?.username && !ownerDetails[video.owner.username]) {
        fetchOwnerDetails(video.owner.username);
      }
    });
  }, [ownerDetails, fetchOwnerDetails]);

  const clearVideos = useCallback(() => {
    setVideos([]);
    setCurrentPage(1);
    setTotalPages(0);
  }, []);

  const value = {
    videos,
    updateVideos,
    clearVideos,
    ownerDetails,
    currentPage,
    totalPages,
    fetchOwnerDetails
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
