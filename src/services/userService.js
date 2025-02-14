import apiClient from "../utils/axios";

export const getChannelDetails = async (username) => {
  try {
    const response = await apiClient.get(`/users/channel/${username}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to fetch channel details'
    };
  }
};
