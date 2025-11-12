// src/redux/driverListingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetData } from "../api/apiHelpers";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "driverListingArray";

const initialState = {
  drivers: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
};

const transformDriverData = (data = []) =>
  data.map((item) => ({
    driverId: item.id,
    driverName: `${item.full_name} (${item.total_pickups_today} Pick-ups Today)`,
    vehicleName: item.vehicle_name,
    maxCapacity: item.tyre_capacity,
    selectedTyres: item.scheduled_tyres_count,
    vehicleType: item.vehicle_type,
    capacityKgs: item.capacity_kgs,
  }));

export const fetchDriverListings = createAsyncThunk(
  "drivers/fetchListings",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await GetData(
        `/drivers/listings?page=${page}&page_size=${pageSize}`
      );
      return transformDriverData(res.data.items || []);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch drivers");
    }
  }
);

const driverListingSlice = createSlice({
  name: "driverListing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDriverListings.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
        saveToLocalStorage(STORAGE_KEY, state.drivers);
      })
      .addCase(fetchDriverListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default driverListingSlice.reducer;
