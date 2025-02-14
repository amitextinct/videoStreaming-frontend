import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import useVideo from '../context/useVideo';
import apiClient from '../utils/axios';
import VideoCard from '../components/VideoCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateVideos, videos, totalPages, currentPage } = useVideo();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const fetchVideos = useCallback(async (page, query) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/videos?page=${page}&limit=12${query ? `&query=${query}` : ''}`);
      if (response.data.success) {
        updateVideos(response.data.data.videos, page, response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateVideos]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      fetchVideos(1, query);
    }
  }, [searchParams, fetchVideos]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      fetchVideos(1, searchQuery);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      fetchVideos(currentPage + 1, searchQuery);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && videos.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          
          {currentPage < totalPages && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          {searchQuery ? 'No videos found matching your search.' : 'Start searching to find videos.'}
        </div>
      )}
    </div>
  );
}
