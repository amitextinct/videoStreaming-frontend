import apiClient from "../utils/axios";

export const toggleSubscription = async (channelId) => {
  try {
    const response = await apiClient.post(`/subscriptions/c/${channelId}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update subscription'
    };
  }
};

export const getChannelSubscribers = async (subscriberId) => {
  try {
    const response = await apiClient.get(`/subscriptions/u/${subscriberId}`);
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

export const getSubscribedChannels = async (channelId) => {
  try {
    const response = await apiClient.get(`/subscriptions/c/${channelId}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch subscribed channels'
    };
  }
};
