import apiClient from "../utils/axios";

export const fetchVideoComments = async (videoId, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/comments/${videoId}?page=${page}&limit=${limit}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch comments'
    };
  }
};

export const addComment = async (videoId, content) => {
  try {
    const response = await apiClient.post(`/comments/${videoId}`, { content });
    return {
      success: response.data.statusCode === 201,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to add comment'
    };
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await apiClient.patch(`/comments/c/${commentId}`, { content });
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to update comment'
    };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/comments/c/${commentId}`);
    return {
      success: response.data.statusCode === 200,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete comment'
    };
  }
};
