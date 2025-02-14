import { useState, useEffect } from 'react';
import { fetchTweets, createTweet, deleteTweet } from '../services/Services';
import { useUser } from '../context/useUser';
import { getSecureUrl } from '../utils/secureUrl';  // Add this import
import LikeButton from '../components/common/LikeButton';
import { toast } from 'react-hot-toast';

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    loadTweets();
  }, []);

  const loadTweets = async () => {
    const response = await fetchTweets();
    if (response.success) {
      const tweetsWithLikes = response.data.map(tweet => ({
        ...tweet,
        likes: tweet.likesCount || 0,
        isLiked: tweet.isLiked || false
      }));
      setTweets(tweetsWithLikes);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;

    const response = await createTweet(newTweet);
    if (response.success) {
      setNewTweet('');
      loadTweets();
      toast.success('Tweet posted successfully');
    } else {
      toast.error('Failed to post tweet');
    }
  };

  const handleDelete = async (tweetId) => {
    const response = await deleteTweet(tweetId);
    if (response.success) {
      loadTweets();
      toast.success('Tweet deleted successfully');
    } else {
      toast.error('Failed to delete tweet');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="animate-pulse text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        {user && (
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
            <form onSubmit={handleSubmit}>
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/50 backdrop-blur-sm border-0 
                          focus:ring-2 focus:ring-blue-400 focus:outline-none
                          placeholder-gray-500 text-gray-800"
                placeholder="What's on your mind?"
                rows="3"
              />
              <button
                type="submit"
                className="mt-3 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 
                         text-white rounded-full hover:from-blue-600 hover:to-blue-700 
                         transform transition duration-200 hover:scale-105 
                         shadow-lg hover:shadow-xl active:scale-95"
              >
                Tweet
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 
                       shadow-lg border border-white/50 
                       transform transition duration-200 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/50">
                      <img
                        src={getSecureUrl(tweet.owner?.avatar) || `https://ui-avatars.com/api/?name=${tweet.owner?.fullName || 'U'}&background=random`}
                        alt={tweet.owner?.fullName || 'Unknown User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${tweet.owner?.fullName || 'U'}&background=random`;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 
                                  bg-clip-text text-transparent">
                        {tweet.owner?.fullName || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tweet.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 leading-relaxed ml-15">
                    {tweet.content}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <LikeButton 
                    type="t"
                    id={tweet._id}
                    initialIsLiked={tweet.isLiked}
                    initialLikes={tweet.likesCount || 0}
                    size="md"
                  />
                  {user?._id === tweet.owner?._id && (
                    <button
                      onClick={() => handleDelete(tweet._id)}
                      className="ml-4 p-2 rounded-full hover:bg-red-100/50 
                               group transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-400 group-hover:text-red-600 
                                 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
