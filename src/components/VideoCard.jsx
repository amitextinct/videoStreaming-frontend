import { useNavigate, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { getSecureUrl } from '../utils/secureUrl';
import useVideo from '../context/useVideo';
import { useEffect } from 'react';

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { ownerDetails, fetchOwnerDetails } = useVideo();
  const isSearchPage = location.pathname === '/search';

  useEffect(() => {
    if (video?.owner?.username && !ownerDetails[video.owner.username]) {
      fetchOwnerDetails(video.owner.username);
    }
  }, [video.owner.username, ownerDetails, fetchOwnerDetails]);

  const channelData = ownerDetails[video.owner?.username];

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  };

  const handleChannelClick = (e) => {
    if (isSearchPage) {
      e.stopPropagation(); // Prevent video navigation
      // Add userId to search params
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('userId', video.owner._id);
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const handleVideoClick = () => {
    navigate(`/watch/${video._id}`);
  };

  return (
    <div 
      className="flex flex-col group cursor-pointer"
      onClick={handleVideoClick}
    >
      {/* Thumbnail container */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
        <img
          src={getSecureUrl(video.thumbnail)}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Video info */}
      <div className="mt-4 px-4 pb-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <img
              src={getSecureUrl(channelData?.avatar)}
              alt={channelData?.fullName || video.owner?.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${video.owner?.fullName || 'U'}&background=random`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
              {video.title}
            </h3>
            <p 
              className="mt-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
              onClick={handleChannelClick}
            >
              {video.owner.fullName || video.owner.username}
            </p>
            <div className="flex items-center gap-x-1 text-sm text-gray-500">
              <span>{formatViews(video.views)}</span>
              <span>•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      avatar: PropTypes.string,  // Added avatar prop validation
    }).isRequired,
  }).isRequired,
};
