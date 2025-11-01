// Import necessary libraries and components
import { Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginSrceen from "./components/authentication/LoginSrceen";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/settings/Settings";
import SubscriptionPlan from "./pages/settings/SubscriptionPlan";
import Driver from "./pages/settings/Driver";
import Role from "./pages/settings/Role";
import PostCode from "./pages/settings/PostCode";
import User from "./pages/settings/User";
import Pickups from "./pages/pickups/Pickups";
import Store from "./pages/store/Store";
import ForgotPassword from "./components/authentication/ForgotPassword";
import GetOTPcomp from "./components/authentication/GetOTPcomp";
import ResetPassword from "./components/authentication/ResetPassword";
import "./App.css";
import ManageStore from "./pages/store/ManageStore";
import Wtns from "./pages/store/Wtns";
import Invoices from "./pages/store/Invoices";
import SubPickups from "./pages/pickups/SubPickups";
import PickupsHistory from "./pages/pickups/PickupsHistory";
import ManageSchedulePickups from "./pages/pickups/ManageSchedulePickups";
import ManageScheduleAssign from "./pages/pickups/ManageScheduleAssign";
import DriverTracking from "./pages/pickups/DriverTracking";
import ViewAllNotifications from "./layouts/ViewAllNotifications";

const App = () => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginSrceen />}></Route>
          <Route path="/forget" element={<ForgotPassword />}></Route>
          <Route path="/getotp" element={<GetOTPcomp />}></Route>
          <Route path="/resetpassword" element={<ResetPassword />}></Route>

          {/* Protected Routes */}
          <Route
            path="/viewallnotications"
            element={
              <ProtectedRoute>
                <ViewAllNotifications />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="subscription" replace />} />
            <Route path="subscription" element={<SubscriptionPlan />} />
            <Route path="driver" element={<Driver />} />
            <Route path="role" element={<Role />} />
            <Route path="user" element={<User />} />
            <Route path="postcode" element={<PostCode />} />
          </Route>
          <Route
            path="/pickups"
            element={
              <ProtectedRoute>
                <Pickups />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="subPickups" replace />} />
            <Route path="subPickups" element={<SubPickups />} />
            <Route path="manage" element={<ManageSchedulePickups />} />
            <Route path="assign" element={<ManageScheduleAssign />} />
            <Route path="drivertracking" element={<DriverTracking />} />
            <Route path="pickupsHistory" element={<PickupsHistory />} />
          </Route>
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="manageStore" replace />} />
            <Route path="manageStore" element={<ManageStore />} />
            <Route path="wtns" element={<Wtns />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>
        </Routes>
      </LocalizationProvider>
    </>
  );
};

export default App;
