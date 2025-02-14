import PropTypes from 'prop-types';
import { useState } from 'react';
import { getSecureUrl } from '../../utils/secureUrl';
import { formatDuration } from '../../utils/timeFormat';
import { toggleVideoPublish } from '../../services/dashboardService';
import { toast } from 'react-hot-toast';

function VideosList({ videos, onVideoUpdate }) {
  const [loadingStates, setLoadingStates] = useState({});

  const handlePublishToggle = async (videoId, currentStatus) => {
    setLoadingStates(prev => ({ ...prev, [videoId]: true }));
    try {
      const response = await toggleVideoPublish(videoId);
      if (response.success) {
        onVideoUpdate(videoId, { isPublished: !currentStatus });
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch  {
      toast.error('Failed to update video status');
    } finally {
      setLoadingStates(prev => ({ ...prev, [videoId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map(video => (
          <div key={video._id} className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={getSecureUrl(video.thumbnail)}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium truncate">{video.title}</h3>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>{video.views} views</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${
                  video.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {video.isPublished ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => handlePublishToggle(video._id, video.isPublished)}
                  disabled={loadingStates[video._id]}
                  className={`text-sm px-3 py-1 rounded-full transition-colors
                    ${video.isPublished 
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'}
                    ${loadingStates[video._id] ? 'opacity-50 cursor-wait' : ''}
                  `}
                >
                  {loadingStates[video._id]
                    ? 'Updating...'
                    : video.isPublished
                      ? 'Unpublish'
                      : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

VideosList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      views: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      isPublished: PropTypes.bool.isRequired
    })
  ).isRequired,
  onVideoUpdate: PropTypes.func.isRequired
};

export default VideosList;
