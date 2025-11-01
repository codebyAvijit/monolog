// src/store/slices/roleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData, PostData, PutData, DeleteData } from "../api/apiHelpers";

const STORAGE_KEY = "mainRolesArray";

const initialState = {
  roles: loadFromLocalStorage(STORAGE_KEY, []),
  searchResults: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 0,
  },
};

// Fetch All Roles with Pagination
export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async ({ page = 1, page_size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await GetData(
        `/roles?page=${page}&page_size=${page_size}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch roles"
      );
    }
  }
);

// Fetch Single Role by ID
export const fetchRoleById = createAsyncThunk(
  "role/fetchRoleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetData(`/admin/roles/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch role"
      );
    }
  }
);

// Create New Role
export const createRole = createAsyncThunk(
  "role/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const payload = {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || [],
      };
      const response = await PostData("/admin/roles", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to create role"
      );
    }
  }
);

// Update Role
export const updateRole = createAsyncThunk(
  "role/updateRole",
  async ({ id, name, description, permissions }, { rejectWithValue }) => {
    try {
      const payload = {
        name,
        description,
        permissions: permissions || [],
      };
      const response = await PutData(`/admin/roles/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to update role"
      );
    }
  }
);

// Delete Role
export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      await DeleteData(`/admin/roles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to delete role"
      );
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        const { items, total, page, page_size, total_pages } = action.payload;

        // Format roles for consistent structure
        const formatted = items.map((item) => ({
          id: item.id,
          roleId: item.id, // For table display
          role: item.name,
          name: item.name,
          description: item.description,
          permissions: item.permissions || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        state.roles = formatted;
        state.pagination = {
          total,
          page,
          page_size,
          total_pages,
        };

        saveToLocalStorage(STORAGE_KEY, state.roles);
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Role
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the specific role in the array
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = {
            ...state.roles[index],
            ...action.payload,
          };
          saveToLocalStorage(STORAGE_KEY, state.roles);
        }
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        const newRole = {
          id: action.payload.id,
          roleId: action.payload.id,
          role: action.payload.name,
          name: action.payload.name,
          description: action.payload.description,
          permissions: action.payload.permissions || [],
          created_at: action.payload.created_at,
          updated_at: action.payload.updated_at,
        };
        state.roles.push(newRole);
        saveToLocalStorage(STORAGE_KEY, state.roles);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = {
            id: action.payload.id,
            roleId: action.payload.id,
            role: action.payload.name,
            name: action.payload.name,
            description: action.payload.description,
            permissions: action.payload.permissions || [],
            created_at: action.payload.created_at,
            updated_at: action.payload.updated_at,
          };
        }
        saveToLocalStorage(STORAGE_KEY, state.roles);
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
        saveToLocalStorage(STORAGE_KEY, state.roles);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSearchResults } = roleSlice.actions;
export default roleSlice.reducer;
