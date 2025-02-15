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

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/current-user');
    return {
      success: response.data.statusCode === 200,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to fetch user'
    };
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.patch('/users/update-account', userData);
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
  formData.append(type === 'avatar' ? 'avatar' : 'coverImage', file);

  try {
    const response = await apiClient.patch(
      `/users/${type === 'avatar' ? 'avatar' : 'cover-image'}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
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

export const changePassword = async (passwords) => {
  try {
    const response = await apiClient.post('/users/change-password', passwords);
    return {
      success: response.data.statusCode === 200,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to change password'
    };
  }
};
