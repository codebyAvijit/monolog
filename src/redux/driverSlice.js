import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "mainDriverArray";

// Load from localStorage if available
const initialState = {
  drivers: loadFromLocalStorage(STORAGE_KEY, []),
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    addDriver: (state, action) => {
      const newDriver = {
        id: crypto.randomUUID(),
        ...action.payload,
        licenseExpiryDate: action.payload.licenseExpiryDate
          ? dayjs(action.payload.licenseExpiryDate).format("YYYY-MM-DD")
          : null,
        createdOn: dayjs().format("DD-MM-YYYY"),
      };
      state.drivers.push(newDriver);
      //   localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drivers));
      saveToLocalStorage(STORAGE_KEY, state.drivers);
    },

    deleteDriver: (state, action) => {
      state.drivers = state.drivers.filter(
        (driver) => driver.id !== action.payload
      );
      //   localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drivers));
      saveToLocalStorage(STORAGE_KEY, state.drivers);
    },
    updateDriver: (state, action) => {
      const index = state.drivers.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.drivers[index] = {
          ...state.drivers[index],
          ...action.payload,
          licenseExpiryDate: action.payload.licenseExpiryDate
            ? dayjs(action.payload.licenseExpiryDate).format("YYYY-MM-DD")
            : state.drivers[index].licenseExpiryDate,
        };
        // localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drivers));
        saveToLocalStorage(STORAGE_KEY, state.drivers);
      }
    },

    setDrivers: (state, action) => {
      state.drivers = action.payload;
      //   localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drivers));
      saveToLocalStorage(STORAGE_KEY, state.drivers);
    },
  },
});

export const { addDriver, deleteDriver, updateDriver, setDrivers } =
  driverSlice.actions;

export default driverSlice.reducer;
