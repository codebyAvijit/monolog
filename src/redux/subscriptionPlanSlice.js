import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { GetData, PostData, PutData, DeleteData } from "../api/apiHelpers";

const STORAGE_KEY = "mainSubPlanArray";

const initialState = {
  plans: loadFromLocalStorage(STORAGE_KEY, []),
  loading: false,
  error: null,
};

//Use plan_amount for amount, per_tyre_amount for extraCharges

const transformApiData = (apiData) => {
  const items = apiData.items || apiData;
  return items.map((item) => ({
    id: item.id,
    planName: item.name,
    planType: item.plan_type,
    amount: `£${item.plan_amount || 0}`, //  : Use plan_amount
    pickups: `${item.minimum_pickup} Standard, ${item.express_maximum_pickup} Express`,
    extraCharges: `£${item.per_tyre_amount} per tyre`,
    expressExtraCharges: `£${item.express_per_tyre_amount} per tyre`,
    status: item.active ? "Active" : "Inactive",
    createdOn: dayjs(item.created_at).format("DD-MM-YYYY"),
    planActivationDate: item.plan_activation_date
      ? dayjs(item.plan_activation_date).format("DD-MM-YYYY")
      : null,
  }));
};

//  : Send both plan_amount and per_tyre_amount
const transformToApiData = (planData) => {
  const pickups = planData.pickups
    ? planData.pickups.split(",").map((s) => parseInt(s.trim()) || 0)
    : [0, 0];

  return {
    name: planData.planName,
    plan_type: planData.planType,
    plan_amount: parseFloat(planData.amount?.replace(/£/g, "") || 0), //  : Add plan_amount
    per_tyre_amount: parseFloat(
      planData.extraCharges?.replace(/£| per tyre/g, "") || 0
    ), //  : Extract from extraCharges
    minimum_pickup: pickups[0] || 0,
    maximum_pickup: pickups[0] || 0,
    express_maximum_pickup: pickups[1] || 0,
    express_per_tyre_amount: parseFloat(
      planData.expressExtraCharges?.replace(/£| per tyre/g, "") || 0
    ),
    surge_charge: 0.0,
    active: planData.status === "Active",
    plan_activation_date: planData.planActivationDate
      ? dayjs(planData.planActivationDate, "DD-MM-YYYY").format("YYYY-MM-DD")
      : null,
  };
};

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlan/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetData("/subscription-plans");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const createSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/createPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const apiData = transformToApiData(planData);
      const response = await PostData("/subscription-plans", apiData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/updatePlan",
  async ({ id, planData }, { rejectWithValue }) => {
    try {
      const apiData = transformToApiData(planData);
      const response = await PutData(`/subscription-plans/${id}`, apiData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const deleteSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/deletePlan",
  async (id, { rejectWithValue }) => {
    try {
      await DeleteData(`/subscription-plans/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = transformApiData(action.payload);
        saveToLocalStorage(STORAGE_KEY, state.plans);
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;

        const createdData = action.payload.data || action.payload;

        //  : Use plan_amount for amount, per_tyre_amount for extraCharges
        const newPlan = {
          id: createdData.id,
          planName: createdData.name,
          planType: createdData.plan_type,
          amount: `£${createdData.plan_amount || 0}`, //
          pickups: `${createdData.minimum_pickup} Standard, ${createdData.express_maximum_pickup} Express`,
          extraCharges: `£${createdData.per_tyre_amount} per tyre`, //  CORRECT
          expressExtraCharges: `£${createdData.express_per_tyre_amount} per tyre`,
          status: createdData.active ? "Active" : "Inactive",
          createdOn: dayjs(createdData.created_at).format("DD-MM-YYYY"),
          planActivationDate: createdData.plan_activation_date
            ? dayjs(createdData.plan_activation_date).format("DD-MM-YYYY")
            : null,
        };

        state.plans = [...state.plans, newPlan];
        saveToLocalStorage(STORAGE_KEY, state.plans);
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;

        const updatedData = action.payload.data || action.payload;
        const index = state.plans.findIndex((p) => p.id === updatedData.id);

        if (index !== -1) {
          //fix for updates
          const updatedPlan = {
            id: updatedData.id,
            planName: updatedData.name,
            planType: updatedData.plan_type,
            amount: `£${updatedData.plan_amount || 0}`,
            pickups: `${updatedData.minimum_pickup} Standard, ${updatedData.express_maximum_pickup} Express`,
            extraCharges: `£${updatedData.per_tyre_amount} per tyre`,
            expressExtraCharges: `£${updatedData.express_per_tyre_amount} per tyre`,
            status: updatedData.active ? "Active" : "Inactive",
            createdOn: dayjs(updatedData.created_at).format("DD-MM-YYYY"),
            planActivationDate: updatedData.plan_activation_date
              ? dayjs(updatedData.plan_activation_date).format("DD-MM-YYYY")
              : null,
          };

          state.plans[index] = updatedPlan;
          saveToLocalStorage(STORAGE_KEY, state.plans);
        }
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter((plan) => plan.id !== action.payload);
        saveToLocalStorage(STORAGE_KEY, state.plans);
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionPlanSlice.reducer;
