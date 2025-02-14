import { createContext, useContext } from 'react';

export const LikeContext = createContext({
  likeStates: {},  // Record<string, LikeState>
  isLoading: false,
  fetchLikeStatus: (type, id) => Promise.resolve({
    success: false,
    data: { likeCount: 0, isLiked: false }
  }),
  updateLikeStatus: (type, id, data) => {},
  error: null
});

export const useLikes = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikeProvider');
  }
  return context;
};
