import apiClient from "../utils/axios";

export const fetchChannelStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to fetch stats'
    };
  }
};

export const fetchChannelVideos = async () => {
  try {
    const response = await apiClient.get('/dashboard/videos');
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch videos'
    };
  }
};

export const fetchSubscribers = async () => {
  try {
    const response = await apiClient.get('/dashboard/subscriptions');
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch subscribers'
    };
  }
};

export const toggleVideoPublish = async (videoId) => {
  try {
    const response = await apiClient.patch(`/videos/toggle/publish/${videoId}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to toggle video status'
    };
  }
};
