// src/redux/postCodeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

// ==================== API THUNKS (Keep as is) ====================

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

export const fetchDefaultPostCodes = createAsyncThunk(
  "postCode/fetchDefaultPostCodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetData("/postcodes?limit=4");
      const data = response.data.items || response.data || [];
      return data.slice(0, 4);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch default postcodes"
      );
    }
  }
);

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

export const searchPostCodes = createAsyncThunk(
  "postCode/searchPostCodes",
  async ({ query, signal }, { rejectWithValue }) => {
    try {
      const response = await GetData(`/postcodes/search?q=${query || ""}`);

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

// ==================== REDUCER ====================

const postCodeSlice = createSlice({
  name: "postCode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ========== FETCH ALL ==========
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
        saveToLocalStorage(STORAGE_KEY, formatted);
      })
      .addCase(fetchPostCodesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== FETCH DEFAULT ==========
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

      // ========== CREATE (Real-time) ==========
      .addCase(createPostCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostCode.fulfilled, (state, action) => {
        state.loading = false;

        //  Match SubPlan pattern
        const createdData = action.payload.data || action.payload;
        const newPostCode = {
          id: createdData.id,
          postCodeLocation: createdData.postal_code,
          locationName: createdData.location_name,
        };

        state.postCodes = [...state.postCodes, newPostCode];
        state.originalPostCodes = [...state.originalPostCodes, newPostCode];
        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      })
      .addCase(createPostCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== UPDATE (Real-time - FIXED TO MATCH SUBPLAN) ==========
      .addCase(updatePostCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostCode.fulfilled, (state, action) => {
        state.loading = false;

        //  EXACT SubPlan pattern - direct mutation with findIndex
        const updatedData = action.payload.data || action.payload;
        const index = state.postCodes.findIndex((p) => p.id === updatedData.id);

        if (index !== -1) {
          const updatedPostCode = {
            id: updatedData.id,
            postCodeLocation: updatedData.postal_code,
            locationName: updatedData.location_name,
          };

          //  Direct mutation (Immer handles it properly)
          state.postCodes[index] = updatedPostCode;

          // Update originalPostCodes too
          const origIndex = state.originalPostCodes.findIndex(
            (p) => p.id === updatedData.id
          );
          if (origIndex !== -1) {
            state.originalPostCodes[origIndex] = updatedPostCode;
          }

          saveToLocalStorage(STORAGE_KEY, state.postCodes);
        }
      })
      .addCase(updatePostCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== DELETE (Real-time) ==========
      .addCase(deletePostCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostCode.fulfilled, (state, action) => {
        state.loading = false;

        state.postCodes = state.postCodes.filter(
          (item) => item.id !== action.payload
        );
        state.originalPostCodes = state.originalPostCodes.filter(
          (item) => item.id !== action.payload
        );

        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      })
      .addCase(deletePostCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== SEARCH ==========
      .addCase(searchPostCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPostCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPostCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postCodeSlice.reducer;
