import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { toggleSubscription } from '../../services/subscriptionService';
import { useUser } from '../../context/useUser';
import { toast } from 'react-hot-toast';

export default function SubscribeButton({ 
  channelId,
  initialIsSubscribed = false,
  subscriberCount = 0,
  onSubscriptionChange,
  size = 'md',
  showCount = true,
  className = ''
}) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [count, setCount] = useState(subscriberCount);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubscribe = useCallback(async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    if (user._id === channelId) {
      toast.error('You cannot subscribe to your own channel');
      return;
    }

    setIsLoading(true);
    const prevState = isSubscribed;
    const prevCount = count;

    // Optimistic update
    setIsSubscribed(!isSubscribed);
    setCount(count + (isSubscribed ? -1 : 1));

    try {
      const response = await toggleSubscription(channelId);
      if (response.success) {
        toast.success(response.message);
        onSubscriptionChange?.(!prevState);
      } else {
        // Revert on failure
        setIsSubscribed(prevState);
        setCount(prevCount);
        toast.error(response.message);
      }
    } catch {
      // Revert on error
      setIsSubscribed(prevState);
      setCount(prevCount);
      toast.error('Failed to update subscription');
    } finally {
      setIsLoading(false);
    }
  }, [user, channelId, isSubscribed, count, onSubscriptionChange]);

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-2.5 text-lg'
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-full font-medium
        ${isSubscribed 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-red-600 text-white hover:bg-red-700'}
        transition-all duration-200 disabled:opacity-50
        flex items-center gap-2 ${className}`}
    >
      <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
      {showCount && (
        <span className={`${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

SubscribeButton.propTypes = {
  channelId: PropTypes.string.isRequired,
  initialIsSubscribed: PropTypes.bool,
  subscriberCount: PropTypes.number,
  onSubscriptionChange: PropTypes.func,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  showCount: PropTypes.bool,
  className: PropTypes.string
};
