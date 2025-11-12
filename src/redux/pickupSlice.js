import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { GetData } from "../api/apiHelpers";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "mainPickupArray";

const initialState = {
  pickups: loadFromLocalStorage(STORAGE_KEY, []),
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
const transformPickupData = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    id: item.id,
    requestId: item.id.slice(0, 8).toUpperCase(), // simple short id
    pickupLocation: `${item.address?.address_text ?? ""}, ${
      item.address?.city ?? ""
    }, ${item.address?.region ?? ""}, ${item.address?.postal_code ?? ""}, ${
      item.address?.country ?? ""
    }`,
    numberOfTyres: item.no_of_tyres ?? 0,
    pickupDate: item.pickup_date
      ? dayjs(item.pickup_date).format("YYYY-MM-DD")
      : "N/A",
    status: item.status || "N/A",
    requestType: item.request_type || "N/A",
    wtnFilePath: item.wtn_file_path,
    invoiceFilePath: item.invoice_file_path,
  }));
};

/** Async Thunk to fetch pickups */
export const fetchPickupsData = createAsyncThunk(
  "pickup/fetchPickups",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await GetData(
        `/store/pickups?page=${page}&page_size=${pageSize}`
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
      console.error("Fetch Pickups Error:", err);
      return rejectWithValue(err.message || "Failed to fetch pickups");
    }
  }
);

/** Slice */
const pickupSlice = createSlice({
  name: "pickup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPickupsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupsData.fulfilled, (state, action) => {
        state.loading = false;
        const formatted = transformPickupData(action.payload.items);
        state.pickups = formatted;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.page,
          pageSize: action.payload.pageSize,
        };
        saveToLocalStorage(STORAGE_KEY, formatted);
      })
      .addCase(fetchPickupsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pickupSlice.reducer;
