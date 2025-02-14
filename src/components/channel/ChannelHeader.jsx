import PropTypes from 'prop-types';
import { getSecureUrl } from '../../utils/secureUrl';
import SubscribeButton from '../common/SubscribeButton';
import { useUser } from '../../context/useUser';

export default function ChannelHeader({ channel }) {
  const { user } = useUser();
  const isOwner = user?._id === channel._id;
  const defaultCover = "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${channel?.fullName || 'U'}&background=random`;

  return (
    <div className="relative bg-white rounded-lg shadow overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 w-full relative">
        <img
          src={getSecureUrl(channel.coverImage) || defaultCover}
          alt="Channel Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <img
            src={getSecureUrl(channel.avatar) || defaultAvatar}
            alt={channel.fullName}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* Channel Info */}
        <div className="pt-20 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{channel.fullName}</h1>
            <p className="text-gray-500">@{channel.username}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>{channel.subscribersCount.toLocaleString()} subscribers</span>
              <span>{channel.channelsSubscribedToCount.toLocaleString()} subscribed</span>
            </div>
          </div>
          {!isOwner && (
            <SubscribeButton
              channelId={channel._id}
              initialIsSubscribed={channel.isSubscribed}
              subscriberCount={channel.subscribersCount}
              size="lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}

ChannelHeader.propTypes = {
  channel: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    coverImage: PropTypes.string,
    subscribersCount: PropTypes.number.isRequired,
    channelsSubscribedToCount: PropTypes.number.isRequired,
    isSubscribed: PropTypes.bool.isRequired
  }).isRequired
};
