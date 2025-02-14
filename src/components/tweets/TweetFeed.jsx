import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createTweet, fetchTweets, updateTweet, deleteTweet } from '../../api/tweetApi';
import TweetCard from './TweetCard';
import CreateTweet from './CreateTweet';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function TweetFeed({ userId }) {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadTweets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchTweets(page, undefined, userId);
      const newTweets = response.data;
      
      setTweets(prev => page === 1 ? newTweets : [...prev, ...newTweets]);
      setHasMore(newTweets.length === 10);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tweets');
      console.error('Tweet loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, userId]);

  useEffect(() => {
    loadTweets();
  }, [loadTweets]);

  const { observerRef } = useInfiniteScroll(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  });

  const handleCreateTweet = async (content) => {
    try {
      setIsLoading(true);
      const response = await createTweet(content);
      setTweets(prev => [response.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tweet');
      console.error('Tweet creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTweet = async (tweetId, content) => {
    try {
      setIsLoading(true);
      const response = await updateTweet(tweetId, content);
      setTweets(prev =>
        prev.map(tweet =>
          tweet._id === tweetId ? { ...tweet, content: response.data.content } : tweet
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tweet');
      console.error('Tweet update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;
    
    try {
      setIsLoading(true);
      await deleteTweet(tweetId);
      setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete tweet');
      console.error('Tweet deletion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CreateTweet onSubmit={handleCreateTweet} isLoading={isLoading} />
      
      {error && (
        <div className="p-4 text-red-500 text-center">
          {error}
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {tweets.map(tweet => (
          <TweetCard
            key={tweet._id}
            tweet={tweet}
            onEdit={handleUpdateTweet}
            onDelete={handleDeleteTweet}
            isLoading={isLoading}
          />
        ))}
      </div>

      {isLoading && (
        <div className="p-4 text-center text-gray-500">
          Loading tweets...
        </div>
      )}

      {!isLoading && tweets.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No tweets yet.
        </div>
      )}

      <div ref={observerRef} className="h-10" />
    </div>
  );
}

TweetFeed.propTypes = {
  userId: PropTypes.string
};

export default TweetFeed;
