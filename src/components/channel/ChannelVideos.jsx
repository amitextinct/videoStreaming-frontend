import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { getUserVideos } from '../../services/videoService';
import VideoCard from '../VideoCard';
import { toast } from 'react-hot-toast';

export default function ChannelVideos({ userId }) {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await getUserVideos(userId, page);
        if (response.success) {
          const { videos: newVideos, totalVideos } = response.data;
          setVideos(prev => page === 1 ? newVideos : [...prev, ...newVideos]);
          setHasMore(videos.length < totalVideos);
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [userId, page, videos.length]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  if (isLoading && videos.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No videos found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video._id} onClick={() => handleVideoClick(video._id)}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

ChannelVideos.propTypes = {
  userId: PropTypes.string.isRequired
};
