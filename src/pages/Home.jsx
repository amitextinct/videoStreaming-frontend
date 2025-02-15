import { useEffect, useCallback, useState } from 'react';
import useVideo from '../context/useVideo';
import VideoCard from '../components/VideoCard';
import VideoUpload from '../components/VideoUpload';
import apiClient from '../utils/axios';
import Skeletal from '../components/Skeletal';
import { PlusIcon } from '@heroicons/react/24/outline';

function Home() {
  const { videos, updateVideos, currentPage, totalPages } = useVideo();
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/videos?page=1&limit=9&sortType=-1&isPublished=true');
      if (response.data.success) {
        updateVideos(response.data.data.videos, 1, response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateVideos]);

  const fetchNextPage = useCallback(async () => {
    if (isPaginationLoading) return;
    
    try {
      setIsPaginationLoading(true);
      const response = await apiClient.get(`/videos?page=${currentPage + 1}&limit=9&sortType=-1&isPublished=true`);
      if (response.data.success) {
        updateVideos(response.data.data.videos, currentPage + 1, response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching more videos:', error);
    } finally {
      setIsPaginationLoading(false);
    }
  }, [currentPage, isPaginationLoading, updateVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleUploadSuccess = useCallback((newVideo) => {
    updateVideos([newVideo, ...videos], 1, totalPages);
  }, [videos, updateVideos, totalPages]);

  if (isLoading) {
    return <Skeletal />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 pt-20 max-w-6xl">
        <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Videos</h1>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white rounded-lg hover:from-blue-600 hover:to-blue-700 
                       transition-all duration-200 transform hover:scale-105 
                       shadow-lg hover:shadow-xl active:scale-95"
            >
              <PlusIcon className="w-5 h-5" />
              Upload Video
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="backdrop-blur-xl bg-white/30 rounded-2xl 
                                          shadow-lg border border-white/50 overflow-hidden 
                                          transform transition duration-200 hover:scale-[1.02]">
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        {currentPage < totalPages && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchNextPage}
              disabled={isPaginationLoading}
              className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 
                       text-white rounded-lg hover:from-gray-800 hover:to-gray-900 
                       transition-all duration-200 disabled:from-gray-400 
                       disabled:to-gray-400 transform hover:scale-105 
                       shadow-lg hover:shadow-xl active:scale-95"
            >
              {isPaginationLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        <VideoUpload
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </div>
  );
}

export default Home;