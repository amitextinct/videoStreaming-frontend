import PropTypes from 'prop-types';
import { getSecureUrl } from '../../utils/secureUrl';
import { useState } from 'react';
import SubscriptionsOverlay from './SubscriptionsOverlay';

export default function ProfileHeader({ user }) {
  const defaultCover = "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=random`;
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  return (
    <>
      <div className="relative mb-8 bg-white rounded-lg shadow overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 w-full relative">
          <img
            src={getSecureUrl(user?.coverImage) || defaultCover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <img
              src={getSecureUrl(user?.avatar) || defaultAvatar}
              alt={user?.fullName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* User Info */}
          <div className="pt-20 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-500">@{user?.username}</p>
            </div>
            <button
              onClick={() => setShowSubscriptions(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Subscriptions
            </button>
          </div>
        </div>
      </div>

      <SubscriptionsOverlay
        isOpen={showSubscriptions}
        onClose={() => setShowSubscriptions(false)}
        userId={user._id}
      />
    </>
  );
}

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.string,
    coverImage: PropTypes.string
  }).isRequired
};
