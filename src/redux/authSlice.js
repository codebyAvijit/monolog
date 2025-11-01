import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../api/authApi";

// Load persisted auth state from localStorage
const loadAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error("Error loading auth from localStorage:", error);
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password);

      // Save token and user data to localStorage
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: response.user_id,
          email: response.email,
          full_name: response.full_name,
          expires_in: response.expires_in,
          token_type: response.token_type,
        })
      );

      return response;
    } catch (error) {
      // Return error message
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
  return null;
});

// Initial state
const initialState = {
  ...loadAuthFromLocalStorage(),
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Manual logout (without API call)
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.user = {
          user_id: action.payload.user_id,
          email: action.payload.email,
          full_name: action.payload.full_name,
          expires_in: action.payload.expires_in,
          token_type: action.payload.token_type,
        };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
