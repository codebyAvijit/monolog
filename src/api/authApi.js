import axiosInstance from "./axiosConfig";

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with access token and user data
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout user (optional - can be used for future implementation)
 */
export const logoutUser = async () => {
  try {
    // If you have a logout endpoint in the future
    // const response = await axiosInstance.post("/auth/logout");
    // return response.data;

    // For now, just clear local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
