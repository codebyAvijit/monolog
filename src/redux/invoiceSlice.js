import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData } from "../api/apiHelpers";

const STORAGE_KEY = "invoiceArray";

const initialState = {
  invoices: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
};

//  Transform API response
const transformApiData = (apiData) => {
  const items = apiData.items || [];

  return items.map((item) => ({
    id: item.invoice_number || "N/A",
    invoiceNumber: item.invoice_number || "N/A",
    storeName: item.store_name || "N/A",
    storeId: item.store_id || "N/A",
    date: item.date || "N/A",
    amount: item.amount || 0,
    status: item.status || "N/A",
    fileUrl: item.invoice_file_path || null,
    createdAt: item.created_at || "N/A",
    updatedAt: item.updated_at || "N/A",
  }));
};

//  Async thunk
export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async (
    { page = 1, pageSize = 10, storeId = null } = {},
    { rejectWithValue }
  ) => {
    try {
      let url = `/invoices?page=${page}&page_size=${pageSize}`;
      if (storeId) url += `&store_id=${storeId}`; // optional storeId filter
      const response = await GetData(url);
      return response.data;
    } catch (error) {
      console.error("Fetch invoices error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//  Slice
const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = transformApiData(action.payload);
        saveToLocalStorage(STORAGE_KEY, state.invoices);
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer;
