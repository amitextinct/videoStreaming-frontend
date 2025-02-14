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
      <div className="h-32 sm:h-48 w-full relative">
        <img
          src={getSecureUrl(channel.coverImage) || defaultCover}
          alt="Channel Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative px-4 sm:px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
          <img
            src={getSecureUrl(channel.avatar) || defaultAvatar}
            alt={channel.fullName}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* Channel Info */}
        <div className="pt-14 sm:pt-20 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{channel.fullName}</h1>
            <p className="text-sm sm:text-base text-gray-500">@{channel.username}</p>
            <div className="mt-2 flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
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
              showCount={false}
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
