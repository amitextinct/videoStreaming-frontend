import { useUser } from '../context/useUser';
import { useState, useEffect } from 'react';
import { getVideos } from '../services/Services';
import Skeletal from '../components/Skeletal';
import '../index.css';
import { useNavigate } from 'react-router';

function Home() {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await getVideos(currentPage, 9);
        if (response.success) {
          setVideos(response.data.videos);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [currentPage]);

  // Add duration formatter function
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  if (isLoading) {
    return <Skeletal />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Welcome {user?.fullName || 'User'}!</h1>
      
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div 
            key={video._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleVideoClick(video._id)}
          >
            {/* Thumbnail container with duration */}
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 text-xs rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{video.owner.fullName}</span>
                <span>{video.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;