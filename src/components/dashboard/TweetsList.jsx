import PropTypes from 'prop-types';
import { useState } from 'react';
import { deleteTweet } from '../../services/Services';
import LikeButton from '../common/LikeButton';
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

function TweetsList({ tweets, onTweetDelete }) {
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleDelete = async (tweetId) => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;

    setDeletingIds(prev => new Set([...prev, tweetId]));
    try {
      const response = await deleteTweet(tweetId);
      if (response.success) {
        onTweetDelete(tweetId);
        toast.success('Tweet deleted successfully');
      } else {
        toast.error(response.message);
      }
    } catch  {
      toast.error('Failed to delete tweet');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tweetId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        {tweets.map(tweet => (
          <div key={tweet._id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
            <div className="flex justify-between items-center mb-3 min-h-[4rem]">
              <p className="text-gray-800 flex-1 text-xl leading-relaxed">{tweet.content}</p>
              <div className="flex items-center gap-4 ml-4 shrink-0">
                <LikeButton
                  type="tweet"
                  id={tweet._id}
                  initialIsLiked={tweet.isLiked}
                  initialLikes={tweet.likesCount}
                  size="md"
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-lg"
                />
                <button
                  onClick={() => handleDelete(tweet._id)}
                  disabled={deletingIds.has(tweet._id)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 
                            transition-colors duration-200 disabled:opacity-50"
                  title="Delete tweet"
                >
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-gray-500 font-medium">
                {new Date(tweet.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TweetsList.propTypes = {
  tweets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      likesCount: PropTypes.number.isRequired,
      isLiked: PropTypes.bool.isRequired
    })
  ).isRequired,
  onTweetDelete: PropTypes.func.isRequired
};

export default TweetsList;
