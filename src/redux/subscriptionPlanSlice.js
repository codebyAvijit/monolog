// src/redux/subscriptionPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "mainSubPlanArray";

// initial state (try to load from localStorage if present)
const initialState = {
  // plans: JSON.parse(localStorage.getItem("mainSubPlanArray")) || [],
  plans: loadFromLocalStorage(STORAGE_KEY || []),
};

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState,
  reducers: {
    addPlan: (state, action) => {
      const newPlan = {
        id: crypto.randomUUID(),
        ...action.payload,
        createdOn: dayjs().format("DD-MM-YYYY"),
      };
      state.plans.push(newPlan);
      // localStorage.setItem("mainSubPlanArray", JSON.stringify(state.plans));
      saveToLocalStorage(STORAGE_KEY, state.plans);
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter((plan) => plan.id !== action.payload);
      // localStorage.setItem("mainSubPlanArray", JSON.stringify(state.plans));'
      saveToLocalStorage(STORAGE_KEY, state.plans);
    },
    updatePlan: (state, action) => {
      const index = state.plans.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = {
          ...state.plans[index],
          ...action.payload,
        };
        // localStorage.setItem("mainSubPlanArray", JSON.stringify(state.plans));
        saveToLocalStorage(STORAGE_KEY, state.plans);
      }
    },
    setPlans: (state, action) => {
      state.plans = action.payload;
      // localStorage.setItem("mainSubPlanArray", JSON.stringify(state.plans));
      saveToLocalStorage(STORAGE_KEY, state.plans);
    },
  },
});

export const { addPlan, deletePlan, updatePlan, setPlans } =
  subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
