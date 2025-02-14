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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 pt-20 max-w-6xl">
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <VideoPlayer videoUrl={secureVideoUrl} title={video.title} />
          
          <div className="p-6 space-y-6">
            {/* Title and Like Button */}
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <LikeButton 
                type="v"
                id={video._id}
                initialIsLiked={video.isLiked}
                initialLikes={video.likes}
                size="lg"
                className="bg-white/50 hover:bg-white/75 p-2 rounded-lg"
              />
            </div>
            
            {/* Channel Info Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-4 group cursor-pointer"
                  onClick={handleChannelClick}
                >
                  <div className="relative">
                    <img
                      src={getSecureUrl(channelData?.avatar)}
                      alt={channelData?.fullName}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white/50 
                              group-hover:ring-blue-500 transition-all"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 
                                  group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                      {video.owner.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {channelData?.subscribersCount?.toLocaleString() || 0} subscribers
                    </p>
                  </div>
                </div>
                <SubscribeButton
                  channelId={video.owner._id}
                  initialIsSubscribed={channelData?.isSubscribed}
                  subscriberCount={channelData?.subscribersCount || 0}
                  size="lg"
                />
              </div>
            </div>

            {/* Video Stats and Description */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="font-medium">{video.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-white/30 backdrop-blur-xl rounded-2xl p-6 
                      shadow-lg border border-white/50">
          <Comments videoId={video._id} />
        </div>
      </div>
    </div>
  );
}
