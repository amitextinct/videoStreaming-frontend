import apiClient from "../utils/axios";

export const healthcheck = async () => {
  try {
    const response = await apiClient.get("/healthcheck");
    return response.data || false;
  } catch (error) {
    console.error("Auth validation error:", error);
    return false;
  }
};

export const isUserLoggedIn = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    const response = await apiClient.get("/users/current-user");
    return response.data?.success || false;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    return false;
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/users/login", credentials);
    if (response.data.data?.accessToken) {
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      return { 
        success: true, 
        data: response.data.data
      };
    }
    return { 
      success: false, 
      message: response.data.message || 'Invalid credentials'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    console.error("Login error:", errorMessage);
    return { success: false, message: errorMessage };
  }
};

export const signup = async (userData) => {
  try {
    const response = await apiClient.post("/users/register", userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return {
      success: true,
      message: 'Signup successful',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Signup failed',
    };
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await apiClient.post("/users/refresh-token", {
      refreshToken: refreshToken
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return true;
};

export const getVideos = async (page = 1, limit = 9) => {
  try {
    const response = await apiClient.get(`/videos?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { success: false, message: error.message };
  }
};

export const getVideoById = async (videoId) => {
  try {
    const response = await apiClient.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching video:", error);
    return { success: false, message: error.message };
  }
};
