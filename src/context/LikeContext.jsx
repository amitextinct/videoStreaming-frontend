import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getLikeStatus } from '../services/likeService';
import { LikeContext } from '../hooks/useLikes';

export function LikeProvider({ children }) {
  const [likeStates, setLikeStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchLikeStatus = useCallback(async (type, id) => {
    const cacheKey = `${type}-${id}`;
    setIsLoading(true);
    try {
      const response = await getLikeStatus(type, id);
      if (response.success) {
        setLikeStates(prev => ({
          ...prev,
          [cacheKey]: {
            likeCount: response.data.likeCount,
            isLiked: response.data.isLiked,
            error: null
          }
        }));
      }
      return response;
    } catch (error) {
      setLikeStates(prev => ({
        ...prev,
        [cacheKey]: {
          ...prev[cacheKey],
          error: error.message
        }
      }));
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLikeStatus = useCallback((type, id, data) => {
    const cacheKey = `${type}-${id}`;
    setLikeStates(prev => ({
      ...prev,
      [cacheKey]: {
        likeCount: data.likesCount,
        isLiked: data.liked,
        error: null
      }
    }));
  }, []);

  return (
    <LikeContext.Provider value={{
      likeStates,
      isLoading,
      fetchLikeStatus,
      updateLikeStatus
    }}>
      {children}
    </LikeContext.Provider>
  );
}

LikeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
