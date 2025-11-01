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
  },
});

export default store;
