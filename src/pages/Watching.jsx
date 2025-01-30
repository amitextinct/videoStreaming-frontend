import { useParams } from 'react-router';
import { useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import useVideo from '../context/useVideo';
import { Navigate } from 'react-router';
import { getSecureUrl } from '../utils/secureUrl';

export default function Watching() {
  const { videoId } = useParams();
  const { videos, ownerDetails, fetchOwnerDetails } = useVideo();
  
  const video = videos.find(v => v._id === videoId);
  
  useEffect(() => {
    if (video?.owner?.username && !ownerDetails[video.owner.username]) {
      fetchOwnerDetails(video.owner.username);
    }
  }, [video, ownerDetails, fetchOwnerDetails]);

  if (!video) {
    return <Navigate to="/404" />;
  }

  const channelData = ownerDetails[video.owner?.username];
  const secureVideoUrl = getSecureUrl(video.videoFile);

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <VideoPlayer videoUrl={secureVideoUrl} title={video.title} />
      
      {/* Video info with channel details */}
      <div className="mt-4 space-y-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        
        {/* Channel info section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {channelData?.avatar && (
              <img
                src={getSecureUrl(channelData.avatar)}
                alt={channelData.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-medium">{video.owner.fullName}</h3>
              <p className="text-sm text-gray-500">
                {channelData?.subscribersCount || 0} subscribers
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-600">{video.views} views</p>
            <span className="text-gray-400">•</span>
            <p className="text-gray-600">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Video description */}
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">
          {video.description}
        </p>
      </div>
    </div>
  );
}
