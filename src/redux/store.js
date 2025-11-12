// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import subscriptionPlanReducer from "./subscriptionPlanSlice";
import driverReducer from "./driverSlice";
import userReducer from "./userSlice";
import postCodeReducer from "./postCodeSlice";
import storeReducer from "./storeSlice";
import invoiceReducer from "./invoiceSlice";
import wtnsReducer from "./wtnsSlice";
import roleReducer from "./roleSlice";
import pickupReducer from "./pickupSlice";
import pickupHistoryReducer from "./pickupHistorySlice";
import driverListingReducer from "./driverListingSlice";
import requestedPickupsReducer from "./requestedPickupsSlice";
import dashboardReducer from "./dashboardSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    subscriptionPlan: subscriptionPlanReducer,
    driver: driverReducer,
    user: userReducer,
    postCode: postCodeReducer,
    stores: storeReducer,
    invoices: invoiceReducer,
    wtns: wtnsReducer,
    role: roleReducer,
    pickup: pickupReducer,
    pickupHistory: pickupHistoryReducer,
    driverListing: driverListingReducer,
    requestedPickups: requestedPickupsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
