import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../context/useUser';
import { getSecureUrl } from '../utils/secureUrl';
import LikeButton from './common/LikeButton';
import { toast } from 'react-hot-toast';
import {
  fetchVideoComments,
  addComment,
  updateComment,
  deleteComment
} from '../services/commentService';

function Comments({ videoId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = useCallback(async (pageNum) => {
    try {
      setIsLoading(true);
      const response = await fetchVideoComments(videoId, pageNum);
      if (response.success) {
        const commentsWithLikes = response.data.map(comment => ({
          ...comment,
          likes: comment.likesCount || 0,
          isLiked: comment.isLiked || false
        }));
        
        if (pageNum === 1) {
          setComments(commentsWithLikes);
        } else {
          setComments(prev => [...prev, ...commentsWithLikes]);
        }
        setHasMore(response.data.length === 10);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error('Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await addComment(videoId, newComment.trim());
      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(commentId, editContent.trim());
      if (response.success) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { ...comment, content: response.data.content }
              : comment
          )
        );
        setEditingId(null);
        setEditContent('');
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Comment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment._id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={getSecureUrl(comment.createdBy.avatar) || `https://ui-avatars.com/api/?name=${comment.createdBy.fullName}`}
              alt={comment.createdBy.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{comment.createdBy.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <LikeButton 
                    type="c"
                    id={comment._id}
                    initialIsLiked={comment.isLiked}
                    initialLikes={comment.likes}
                    size="sm"
                  />
                  {user?._id === comment.createdBy._id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditContent(comment.content);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {editingId === comment._id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(comment._id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="mt-4 w-full p-2 text-center text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Load More Comments'}
        </button>
      )}
    </div>
  );
}

Comments.propTypes = {
  videoId: PropTypes.string.isRequired
};

export default Comments;
