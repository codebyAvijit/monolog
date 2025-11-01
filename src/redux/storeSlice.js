// src/redux/storeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData } from "../api/apiHelpers";

const STORAGE_KEY = "storesArray";

const initialState = {
  stores: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
};

// Transform backend response
const transformApiData = (apiData) => {
  const items = apiData.items || [];

  return items.map((item) => ({
    id: item.id,
    store: item.store_user?.full_name || "N/A",
    phoneNumber: item.store_user?.phone_number || "N/A",
    buisnessType: item.business_type?.type || "N/A",
    address:
      item.addresses && item.addresses.length > 0
        ? `${item.addresses[0].address_text}, ${item.addresses[0].city}, ${item.addresses[0].region}, ${item.addresses[0].country}`
        : "N/A",
    vat_no: item.vat_no || "N/A",
    cin_no: item.cin_no || "N/A",
    hours_of_operation: item.hours_of_operation || [],
  }));
};

// Async thunk
export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await GetData(
        `/stores/all?page=${page}&page_size=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetch stores error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//FUTURE THUNKS for create, update, delete

// Slice
const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = transformApiData(action.payload);
        saveToLocalStorage(STORAGE_KEY, state.stores);
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;
