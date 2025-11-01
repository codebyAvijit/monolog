import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData, PostData, PutData, DeleteData } from "../api/apiHelpers";

const STORAGE_KEY = "mainPostCodeArray";

const initialState = {
  postCodes: loadFromLocalStorage(STORAGE_KEY, []),
  searchResults: [],
  defaultPostCodes: [],
  loading: false,
  error: null,
  originalPostCodes: [],
};

// Fetch All Postcodes
export const fetchPostCodesData = createAsyncThunk(
  "postCode/fetchPostCodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetData("/postcodes");
      return response.data.items || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch postcodes"
      );
    }
  }
);

// Fetch Default Postcodes (First 4)
export const fetchDefaultPostCodes = createAsyncThunk(
  "postCode/fetchDefaultPostCodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetData("/postcodes?limit=4");
      const data = response.data.items || response.data || [];
      return data.slice(0, 4); // Ensure only 4 items
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch default postcodes"
      );
    }
  }
);

//  Create New Postcode
export const createPostCode = createAsyncThunk(
  "postCode/createPostCode",
  async (postCodeData, { rejectWithValue }) => {
    try {
      const payload = {
        postal_code: postCodeData.postCodeLocation,
        location_name: postCodeData.locationName,
      };
      const response = await PostData("/postcodes", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create postcode"
      );
    }
  }
);

//  Update Postcode
export const updatePostCode = createAsyncThunk(
  "postCode/updatePostCode",
  async ({ id, postCodeLocation, locationName }, { rejectWithValue }) => {
    try {
      const payload = {
        postal_code: postCodeLocation,
        location_name: locationName,
      };
      const response = await PutData(`/postcodes/${id}`, payload);
      const data = response.data;
      return {
        id,
        postal_code: data.postal_code ?? postCodeLocation,
        location_name: data.location_name ?? locationName,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update postcode"
      );
    }
  }
);

// Delete Postcode
export const deletePostCode = createAsyncThunk(
  "postCode/deletePostCode",
  async (id, { rejectWithValue }) => {
    try {
      await DeleteData(`/postcodes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete postcode"
      );
    }
  }
);

// Search Postcodes

export const searchPostCodes = createAsyncThunk(
  "postCode/searchPostCodes",
  async ({ query, signal }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/postcodes/search?q=${query}`, {
        signal,
      });

      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data.items)) return response.data.items;
      if (Array.isArray(response.data.results)) return response.data.results;

      console.warn("Unexpected API format:", response.data);
      return [];
    } catch (err) {
      if (err.name === "CanceledError") throw err;
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postCodeSlice = createSlice({
  name: "postCode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPostCodesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostCodesData.fulfilled, (state, action) => {
        state.loading = false;
        const formatted = action.payload.map((item) => ({
          id: item.id,
          postCodeLocation: item.postal_code,
          locationName: item.location_name,
        }));
        state.postCodes = formatted;
        state.originalPostCodes = formatted;
        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      })
      .addCase(fetchPostCodesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Default (4 postcodes)
      .addCase(fetchDefaultPostCodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDefaultPostCodes.fulfilled, (state, action) => {
        state.loading = false;
        const formatted = action.payload.map((item) => ({
          id: item.id,
          postCodeLocation: item.postal_code,
          locationName: item.location_name,
        }));
        state.defaultPostCodes = formatted;
      })
      .addCase(fetchDefaultPostCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPostCode.fulfilled, (state, action) => {
        const newPostCode = {
          id: action.payload.id,
          postCodeLocation: action.payload.postal_code,
          locationName: action.payload.location_name,
        };
        state.postCodes.push(newPostCode);
        state.originalPostCodes.push(newPostCode);
        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      })

      // Update
      .addCase(updatePostCode.fulfilled, (state, action) => {
        const updateItem = (arr) => {
          const index = arr.findIndex((i) => i.id === action.payload.id);
          if (index !== -1) {
            arr[index] = {
              id: action.payload.id,
              postCodeLocation: action.payload.postal_code,
              locationName: action.payload.location_name,
            };
          }
        };
        updateItem(state.postCodes);
        updateItem(state.originalPostCodes);
        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      })

      // Delete
      .addCase(deletePostCode.fulfilled, (state, action) => {
        const filterOut = (arr) => arr.filter((i) => i.id !== action.payload);
        state.postCodes = filterOut(state.postCodes);
        state.originalPostCodes = filterOut(state.originalPostCodes);
        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      })

      // Search
      .addCase(searchPostCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPostCodes.fulfilled, (state, action) => {
        state.loading = false;
        // Keep the raw format for search results
        state.searchResults = action.payload;
      })
      .addCase(searchPostCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postCodeSlice.reducer;
