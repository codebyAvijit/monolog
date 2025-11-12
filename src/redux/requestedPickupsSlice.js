// src/redux/requestedPickupsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetData } from "../api/apiHelpers";
import dayjs from "dayjs";

const transformPickupData = (data = []) =>
  data.map((item) => ({
    driverId: null, // will be dynamically attached when assigned
    requestId: item.id.slice(0, 8).toUpperCase(),
    store: "N/A",
    pickupLocation: `${item.address?.address_text ?? ""}, ${
      item.address?.city ?? ""
    }, ${item.address?.region ?? ""}, ${item.address?.postal_code ?? ""}, ${
      item.address?.country ?? ""
    }`,
    pickupDateTime: item.pickup_date
      ? dayjs(item.pickup_date).format("DD/MM/YYYY")
      : "N/A",
    requestType: item.request_type || "N/A",
    tyres: item.no_of_tyres || 0,
    status: item.status,
  }));

export const fetchRequestedPickups = createAsyncThunk(
  "pickups/fetchRequested",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetData(
        `/store/pickups?page=1&page_size=10&status=requested`
      );
      return transformPickupData(res.data.items || []);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch requested pickups"
      );
    }
  }
);

const requestedPickupsSlice = createSlice({
  name: "requestedPickups",
  initialState: { pickups: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestedPickups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestedPickups.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload;
      })
      .addCase(fetchRequestedPickups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestedPickupsSlice.reducer;
