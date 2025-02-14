import apiClient from "../utils/axios";

export const getChannelProfile = async (username) => {
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
      message: error.response?.data?.message || 'Failed to fetch channel profile'
    };
  }
};

export const updateChannelDetails = async (data) => {
  try {
    const response = await apiClient.patch('/users/update-account', data);
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

export const updateProfileImage = async (type, file) => {
  const formData = new FormData();
  formData.append(type, file);

  try {
    const response = await apiClient.patch(
      `/users/${type === 'avatar' ? 'avatar' : 'cover-image'}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to update image'
    };
  }
};
