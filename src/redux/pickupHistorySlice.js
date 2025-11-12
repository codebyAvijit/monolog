// src/redux/pickupHistorySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { GetData } from "../api/apiHelpers";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "pickupHistoryArray";

const initialState = {
  pickupHistory: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  },
};

/** Transform API response to UI-friendly structure */
const transformPickupHistoryData = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const tripDurationHours = item.trip_duration_minutes
      ? `${Math.floor(item.trip_duration_minutes / 60)}h ${
          item.trip_duration_minutes % 60
        }m`
      : "N/A";

    return {
      tripId: item.schedule_id?.slice(0, 8).toUpperCase() || "N/A",
      driverName: item.driver_name || "N/A",
      vehicleNumber: item.vehicle_number || "N/A",
      tripStartDateTime: item.trip_start
        ? dayjs(item.trip_start).format("DD/MM/YYYY, hh:mm A")
        : "N/A",
      tripEndDateTime: item.trip_end
        ? dayjs(item.trip_end).format("DD/MM/YYYY, hh:mm A")
        : "N/A",
      totalPickupLocation: item.total_pickups ?? 0,
      totalTyresCollected: item.total_tyres_collected ?? 0,
      mileage: item.miles ?? "N/A",
      tripDuration: tripDurationHours,
      weighmentSlip: item.weighment_slip_url || null, // optional future support
    };
  });
};

/** Async Thunk */
export const fetchPickupHistoryData = createAsyncThunk(
  "pickupHistory/fetchPickupHistory",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await GetData(
        `/pickup-history?page=${page}&page_size=${pageSize}`
      );
      const data = res.data;
      return {
        items: data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.total_pages || 1,
        pageSize: data.page_size || pageSize,
      };
    } catch (err) {
      console.error("Fetch Pickup History Error:", err);
      return rejectWithValue(err.message || "Failed to fetch pickup history");
    }
  }
);

/** Slice */
const pickupHistorySlice = createSlice({
  name: "pickupHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPickupHistoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupHistoryData.fulfilled, (state, action) => {
        state.loading = false;
        const formatted = transformPickupHistoryData(action.payload.items);
        state.pickupHistory = formatted;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.page,
          pageSize: action.payload.pageSize,
        };
        saveToLocalStorage(STORAGE_KEY, formatted);
      })
      .addCase(fetchPickupHistoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pickupHistorySlice.reducer;
