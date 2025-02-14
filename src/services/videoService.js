import apiClient from "../utils/axios";

export const getUserVideos = async (userId, page = 1, limit = 9, sortType = -1) => {
  try {
    const response = await apiClient.get(`/videos?userId=${userId}&page=${page}&limit=${limit}&sortType=${sortType}`);
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

export const uploadVideo = async (videoData) => {
  try {
    const formData = new FormData();
    formData.append('videoFile', videoData.videoFile);
    formData.append('thumbnail', videoData.thumbnail);
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);

    const response = await apiClient.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: response.data.statusCode === 201,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to upload video'
    };
  }
};

export const getVideoById = async (videoId) => {
  try {
    const response = await apiClient.get(`/videos/${videoId}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to fetch video'
    };
  }
};
