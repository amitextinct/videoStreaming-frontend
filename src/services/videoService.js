import apiClient from "../utils/axios";

export const getUserVideos = async (userId, page = 1, limit = 12) => {
  try {
    const response = await apiClient.get(`/videos?userId=${userId}&page=${page}&limit=${limit}&sortType=-1`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: { videos: [], totalVideos: 0, currentPage: 1 },
      message: error.response?.data?.message || 'Failed to fetch videos'
    };
  }
};
