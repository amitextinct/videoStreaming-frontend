import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getChannelSubscribers, getSubscribedChannels } from '../../services/subscriptionService';
import { getSecureUrl } from '../../utils/secureUrl';
import { toast } from 'react-hot-toast';

function UserCard({ user, subtitle }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <img
        src={getSecureUrl(user.avatar) || `https://ui-avatars.com/api/?name=${user.fullName}`}
        alt={user.fullName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium">{user.fullName}</h3>
        <p className="text-sm text-gray-500">@{user.username}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  subtitle: PropTypes.string
};

export default function SubscriptionsList({ userId, type = 'subscribers' }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = type === 'subscribers' 
          ? await getChannelSubscribers(userId)
          : await getSubscribedChannels(userId);

        if (response.success) {
          const formattedUsers = response.data.map(item => ({
            ...type === 'subscribers' ? item.subscriber : item.channel,
            createdAt: item.createdAt
          }));
          setUsers(formattedUsers);
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error(`Failed to fetch ${type}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, type]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No {type} found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map(user => (
        <UserCard
          key={user.username}
          user={user}
          subtitle={new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        />
      ))}
    </div>
  );
}

SubscriptionsList.propTypes = {
  userId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['subscribers', 'subscribed']),
};
