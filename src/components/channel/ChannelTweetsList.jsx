import PropTypes from 'prop-types';
import LikeButton from '../common/LikeButton';

export default function ChannelTweetsList({ tweets }) {
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

ChannelTweetsList.propTypes = {
  tweets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      likesCount: PropTypes.number.isRequired,
      isLiked: PropTypes.bool.isRequired
    })
  ).isRequired
};
