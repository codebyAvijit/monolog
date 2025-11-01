import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData, PostData, PutData, DeleteData } from "../api/apiHelpers";

const STORAGE_KEY = "mainDriverArray";

const initialState = {
  drivers: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
};

// Transform API to App data
const transformDriverData = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const vehicleData = item.vehicle || item;

    return {
      id: item.id,
      driverName: item.full_name || "N/A",
      phoneNumber: item.phone_no || "N/A",
      email: item.email || "N/A",
      licenseNumber: item.license_plate || "N/A",
      licenseExpiryDate: item.license_expiry_date
        ? dayjs(item.license_expiry_date).format("YYYY-MM-DD")
        : "N/A",
      address: item.address || "N/A",
      postCodesCovered: Array.isArray(item.postal_code_ids)
        ? item.postal_code_ids.join(", ")
        : "N/A",
      vehicleType: vehicleData.vehicle_type || "N/A",
      vehicleNumber: vehicleData.vehicle_no || "N/A",
      minTyresRequirement:
        vehicleData.minimum_tyres ?? vehicleData.min_tyres ?? "N/A",
      maxTyresCapacity:
        vehicleData.tyre_capacity ?? vehicleData.capacity_tyres ?? "N/A",
      maxWeight:
        vehicleData.max_weight_kgs ?? vehicleData.capacity_kgs ?? "N/A",
      tyresToday: 0,
      tyresCurrentWeek: 0,
      tyresCurrentMonth: 0,
      planActivationDate: null,
    };
  });
};

//  Transform App form → API data
const transformDriverToApiData = (formData) => ({
  full_name: formData.driverName,
  phone_no: formData.phoneNumber,
  email: formData.email,
  license_plate: formData.licenseNumber,
  license_expiry_date: formData.licenseExpiryDate,
  postal_code_ids: formData.postCodesCovered
    ? formData.postCodesCovered.split(",").map((s) => s.trim())
    : [],
  address: formData.address,
  vehicle: {
    vehicle_type: formData.vehicleType?.toLowerCase(),
    vehicle_no: formData.vehicleNumber,
    tyre_capacity: parseInt(formData.maxTyresCapacity) || 0,
    minimum_tyres: parseInt(formData.minTyresRequirement) || 0,
    capacity_kgs: parseFloat(formData.maxWeight) || 0,
    max_weight_kgs: parseFloat(formData.maxWeight) || 0,
  },
});

//  Fetch all drivers
export const fetchDriversData = createAsyncThunk(
  "driver/fetchDrivers",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await GetData(
        `/drivers/all?page=${page}&page_size=${pageSize}`
      );
      return response.data?.items || [];
    } catch (error) {
      console.error("Fetch Drivers Error:", error);
      return rejectWithValue(error.message || "Failed to fetch drivers");
    }
  }
);

// Create driver
export const createDriver = createAsyncThunk(
  "driver/createDriver",
  async (formData, { rejectWithValue }) => {
    try {
      const apiData = transformDriverToApiData(formData);
      const response = await PostData("/drivers", apiData);
      return response.data;
    } catch (error) {
      // console.error("Create Driver Error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update driver
export const updateDriver = createAsyncThunk(
  "driver/updateDriver",
  async ({ id, ...formData }, { rejectWithValue }) => {
    try {
      const apiData = transformDriverToApiData(formData);
      const response = await PutData(`/drivers/${id}`, apiData);
      // console.log(" Update API Response:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Update Driver Error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//  Delete driver
export const deleteDriver = createAsyncThunk(
  "driver/deleteDriver",
  async (id, { rejectWithValue }) => {
    try {
      await DeleteData(`/drivers/${id}`);
      return id;
    } catch (error) {
      // console.error("Delete Driver Error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== FETCH DRIVERS =====
      .addCase(fetchDriversData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriversData.fulfilled, (state, action) => {
        state.loading = false;
        const formatted = transformDriverData(action.payload);
        state.drivers = formatted;
        saveToLocalStorage(STORAGE_KEY, formatted);
      })
      .addCase(fetchDriversData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE DRIVER =====
      .addCase(createDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.loading = false;
        const newDriver = transformDriverData([action.payload])[0];
        state.drivers.push(newDriver);
        saveToLocalStorage(STORAGE_KEY, state.drivers);
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE DRIVER =====
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = transformDriverData([action.payload])[0];
        const index = state.drivers.findIndex((d) => d.id === updatedData.id);
        if (index !== -1) {
          state.drivers[index] = updatedData;
          saveToLocalStorage(STORAGE_KEY, state.drivers);
        }
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== DELETE DRIVER =====
      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = state.drivers.filter(
          (driver) => driver.id !== action.payload
        );
        saveToLocalStorage(STORAGE_KEY, state.drivers);
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default driverSlice.reducer;
