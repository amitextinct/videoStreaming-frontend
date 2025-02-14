import { useEffect, useCallback, useState } from 'react';
import useVideo from '../context/useVideo';
import VideoCard from '../components/VideoCard';
import apiClient from '../utils/axios';
import Skeletal from '../components/Skeletal';

function Home() {
  const { videos, updateVideos } = useVideo();
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    if (videos.length > 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await apiClient.get('/videos?page=1&limit=12');
      if (response.data.success) {
        updateVideos(response.data.data.videos, 1, response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [videos.length, updateVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (isLoading) {
    return <Skeletal />;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Home;