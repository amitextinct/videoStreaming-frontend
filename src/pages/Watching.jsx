import { useParams } from 'react-router';
import { useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import useVideo from '../context/useVideo';
import { Navigate } from 'react-router';
import { getSecureUrl } from '../utils/secureUrl';
import Comments from '../components/Comments';
import LikeButton from '../components/common/LikeButton';
import SubscribeButton from '../components/common/SubscribeButton';
import { useNavigate } from 'react-router';

export default function Watching() {
  const { videoId } = useParams();
  const navigate = useNavigate();
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

  const handleChannelClick = () => {
    navigate(`/channel/${video.owner.username}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <VideoPlayer videoUrl={secureVideoUrl} title={video.title} />
      
      {/* Video info with channel details */}
      <div className="mt-4 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <LikeButton 
            type="v"
            id={video._id}
            initialIsLiked={video.isLiked}
            initialLikes={video.likes}
            size="lg"
          />
        </div>
        
        {/* Channel info section */}
        <div 
          className="flex items-center space-x-4 group cursor-pointer"
          onClick={handleChannelClick}
        >
          {channelData?.avatar && (
            <img
              src={getSecureUrl(channelData.avatar)}
              alt={channelData.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
              loading="lazy"
              crossOrigin="anonymous"
            />
          )}
          <div>
            <h3 className="font-medium group-hover:text-blue-500 transition-colors">
              {video.owner.fullName}
            </h3>
            <SubscribeButton
              channelId={video.owner._id}
              initialIsSubscribed={channelData?.isSubscribed}
              subscriberCount={channelData?.subscribersCount || 0}
              size="md"
            />
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

        {/* Video description */}
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">
          {video.description}
        </p>
      </div>

      {/* Add Comments section */}
      <Comments videoId={video._id} />
    </div>
  );
}
