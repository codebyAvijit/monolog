// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import subscriptionPlanReducer from "./subscriptionPlanSlice";
import driverReducer from "./driverSlice";
import userReducer from "./userSlice";
import postCodeReducer from "./postCodeSlice";

const store = configureStore({
  reducer: {
    subscriptionPlan: subscriptionPlanReducer,
    driver: driverReducer,
    user: userReducer,
    postCode: postCodeReducer,
  },
});

export default store;
