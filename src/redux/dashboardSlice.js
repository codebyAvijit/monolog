// src/redux/slices/dashboardSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetData } from "../api/apiHelpers";

const initialState = {
  loading: false,
  error: null,
  data: {
    partners: 0,
    pickups: 0,
    drivers_assigned: 0,
    tyres_picked: 0,
    total_tyres: 0,
    wtns: 0,
    revenue: 0,
    subscriptions: {
      active: 0,
      expired: 0,
      expiring_soon: 0,
    },
  },
};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  // Accept either a string period or an object. normalize below.
  async (period = "today", { rejectWithValue }) => {
    try {
      const safePeriod =
        typeof period === "string" && period ? period : "today";
      const response = await GetData(
        `/dashboard?period=${encodeURIComponent(safePeriod)}`
      );
      // response.data is the JSON body: { message: "...", data: {...} }
      // Return the inner data object so reducers receive the actual data.
      return response?.data?.data ?? {};
    } catch (error) {
      // If apiHelpers throws a friendly Error, it will be caught here.
      return rejectWithValue(error.message || "Failed to fetch dashboard data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // optionally add a reset action if you want
    resetDashboard(state) {
      state.data = initialState.data;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the inner `data` object from the API
        state.data = { ...initialState.data, ...action.payload };
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Failed to load";
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
