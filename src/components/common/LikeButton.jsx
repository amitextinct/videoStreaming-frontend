import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { HandThumbUpIcon as ThumbUpOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as ThumbUpSolid } from '@heroicons/react/24/solid';
import { toggleLike, getLikeStatus } from '../../services/likeService';
import { useUser } from '../../context/useUser';
import { useLikes } from '../../hooks/useLikes';
import { toast } from 'react-hot-toast';


export default function LikeButton({ 
  type, 
  id, 
  initialIsLiked = false, 
  initialLikes = 0, 
  onLikeToggle,
  size = 'md',
  className = ''
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const retryCount = useRef(0);
  const { user } = useUser();
  const { updateLikeStatus } = useLikes();

  // Reset state when props change
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikes);
    retryCount.current = 0;
  }, [initialIsLiked, initialLikes, id]);

  // Fetch initial like status only once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const fetchStatus = async () => {
      if (!user || !id) return;
      
      try {
        const response = await getLikeStatus(type, id);
        if (isMounted && response.success) {
          setIsLiked(response.data.isLiked);
          setLikeCount(response.data.likeCount);
          updateLikeStatus(type, id, {
            liked: response.data.isLiked,
            likesCount: response.data.likeCount
          });
        }
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };

    fetchStatus();
    
    return () => {
      isMounted = false;
    };
  }, [type, id, user, updateLikeStatus]);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to like');
      return;
    }

    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    const prevIsLiked = isLiked;
    const prevCount = likeCount;

    // Optimistic update
    setIsLiked(!prevIsLiked);
    setLikeCount(prevCount + (prevIsLiked ? -1 : 1));

    try {
      const response = await toggleLike(type, id);
      if (response.success) {
        updateLikeStatus(type, id, response.data);
        onLikeToggle?.(response.data.liked);
        toast.success(response.message || (response.data.liked ? 'Added like' : 'Removed like'));
        retryCount.current = 0;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(prevIsLiked);
      setLikeCount(prevCount);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, type, id, isLiked, likeCount, isLoading, onLikeToggle, updateLikeStatus]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`group flex items-center gap-1.5 
                 ${isLoading ? 'opacity-50 cursor-wait' : 'hover:scale-105'}
                 ${error ? 'animate-shake' : ''}
                 transition-all duration-200 ease-in-out ${className}`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      role="button"
      tabIndex={0}
    >
      <div className="relative">
        {isLiked ? (
          <ThumbUpSolid 
            className={`${sizeClasses[size]} text-blue-500 
                       ${isLoading ? 'animate-pulse' : 'animate-like'}`}
          />
        ) : (
          <ThumbUpOutline 
            className={`${sizeClasses[size]} text-gray-500 
                       group-hover:text-blue-500 transition-colors`}
          />
        )}
      </div>
      <span 
        className={`text-sm ${isLiked ? 'text-blue-500' : 'text-gray-600'} 
                   group-hover:text-gray-900 transition-colors`}
        aria-live="polite"
      >
        {likeCount}
      </span>
    </button>
  );
}

LikeButton.propTypes = {
  type: PropTypes.oneOf(['video', 'comment', 'tweet']).isRequired,
  id: PropTypes.string.isRequired,
  initialIsLiked: PropTypes.bool,
  initialLikes: PropTypes.number,
  onLikeToggle: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};
