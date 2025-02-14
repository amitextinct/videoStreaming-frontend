import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getChannel } from '../services/Services';
import apiClient from '../utils/axios';  // Add this import

const VideoContext = createContext();

function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const fetchInitialVideos = useCallback(async () => {
    if (isInitialized) return;
    try {
      const response = await apiClient.get('/videos?page=1&limit=9&sortType=-1&isPublished=true');
      if (response.data.success) {
        setVideos(response.data.data.videos);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(1);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error fetching initial videos:', error);
    }
  }, [isInitialized]);

  const value = {
    videos,
    updateVideos,
    clearVideos,
    ownerDetails,
    currentPage,
    totalPages,
    fetchOwnerDetails,
    fetchInitialVideos,
    isInitialized
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
