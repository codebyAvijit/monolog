// src/redux/wtnSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData } from "../api/apiHelpers";

const STORAGE_KEY = "wtnsArray";

const initialState = {
  wtns: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
};

//  Transform API response
const transformApiData = (apiData) => {
  const items = apiData.items || [];

  return items.map((item) => ({
    id: item.id || "N/A",
    wtnId: item.wtn_id || "N/A",
    date: item.date || "N/A",
    numberOfTyres: item.number_of_tyres ?? 0,
    eSigned: item.e_signed ? "Yes" : "No",
    pickupId: item.pickup_id || "N/A",
    docusignEnvelopeId: item.docusign_envelope_id || "N/A",
    wtnFileUrl: item.wtn_file_path || null,
    storeId: item.store_id || "N/A",
    storeName: item.store_name || "N/A",
    driverId: item.driver_id || "N/A",
  }));
};

//  Async thunk
export const fetchWtns = createAsyncThunk(
  "wtns/fetchWtns",
  async (
    { page = 1, pageSize = 10, storeId = null } = {},
    { rejectWithValue }
  ) => {
    try {
      let url = `/wtns?page=${page}&page_size=${pageSize}`;
      if (storeId) url += `&store_id=${storeId}`;
      const response = await GetData(url);
      return response.data;
    } catch (error) {
      // console.error("Fetch WTN error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//  Slice
const wtnSlice = createSlice({
  name: "wtns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWtns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWtns.fulfilled, (state, action) => {
        state.loading = false;
        state.wtns = transformApiData(action.payload);
        saveToLocalStorage(STORAGE_KEY, state.wtns);
      })
      .addCase(fetchWtns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wtnSlice.reducer;
