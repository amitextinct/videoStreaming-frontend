import apiClient from "../utils/axios";

// Update TYPE_MAP to match the API endpoint requirements
const TYPE_MAP = {
  'video': 'v',
  'comment': 'c',
  'tweet': 't',
  // Add reverse mapping for backward compatibility
  'v': 'v',
  'c': 'c',
  't': 't'
};

export const getLikeStatus = async (type, id) => {
  const mappedType = TYPE_MAP[type] || type;
  try {
    const response = await apiClient.get(`/likes/status/${mappedType}/${id}`);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get like status',
      data: { likeCount: 0, isLiked: false }
    };
  }
};

export const toggleLike = async (type, id) => {
  const mappedType = TYPE_MAP[type] || type;
  try {
    const response = await apiClient.post(`/likes/toggle/${mappedType}/${id}`);
    const data = response.data;
    return {
      success: data.statusCode === 200,
      data: {
        liked: !!data.data.likedBy,
        likesCount: data.data.likeCount || 0,
        _id: data.data._id
      },
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to toggle like',
      data: { liked: false, likesCount: 0, _id: null }
    };
  }
};

export const getLikedVideos = async () => {
  try {
    const response = await apiClient.get('/likes/videos');
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch liked videos',
      data: []
    };
  }
};
