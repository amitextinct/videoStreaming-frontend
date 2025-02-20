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

export const getChannel = async (username) => {
  try {
    const response = await apiClient.get(`/users/channel/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching channel:", error);
    return { success: false, message: error.message };
  }
};

// Tweet-related functions
export const fetchTweets = async (page = 1, limit = 10, userId = null) => {
  try {
    const endpoint = userId ? `/tweets/user/${userId}` : '/tweets';
    const response = await apiClient.get(`${endpoint}?page=${page}&limit=${limit}`);
    // Ensure likes data is included in the response
    if (response.data.success) {
      response.data.data = response.data.data.map(tweet => ({
        ...tweet,
        likes: tweet.likesCount || 0,
        isLiked: tweet.isLiked || false
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return { success: false, message: error.message };
  }
};

export const createTweet = async (content) => {
  try {
    const response = await apiClient.post('/tweets', { content });
    return response.data;
  } catch (error) {
    console.error("Error creating tweet:", error);
    return { success: false, message: error.message };
  }
};

export const updateTweet = async (tweetId, content) => {
  try {
    const response = await apiClient.patch(`/tweets/${tweetId}`, { content });
    return response.data;
  } catch (error) {
    console.error("Error updating tweet:", error);
    return { success: false, message: error.message };
  }
};

export const deleteTweet = async (tweetId) => {
  try {
    const response = await apiClient.delete(`/tweets/${tweetId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tweet:", error);
    return { success: false, message: error.message };
  }
};

export const getUserTweets = async (userId, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/tweets/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    return { success: false, message: error.message };
  }
};

export const toggleLike = async (type, id) => {
  try {
    const response = await apiClient.post(`/likes/toggle/${type}/${id}`);
    return {
      success: true,
      data: {
        liked: response.data.data.liked,
        likesCount: response.data.data.likesCount || 0
      }
    };
  } catch (error) {
    console.error(`Error toggling ${type} like:`, error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to toggle like',
      data: { liked: false, likesCount: 0 }
    };
  }
};

export const getLikedVideos = async () => {
  try {
    const response = await apiClient.get('/likes/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    return { success: false, message: error.message };
  }
};

// Add this new function to get likes count
export const getLikesCount = async (type, id) => {
  try {
    const response = await apiClient.get(`/likes/count/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching likes count:", error);
    return { success: false, count: 0 };
  }
};
