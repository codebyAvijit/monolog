// Import necessary libraries and components
import { Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoginSrceen from "./components/authentication/LoginSrceen";
import Dashboard from "./pages/Dashboard/Dashboard";
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

const App = () => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route path="/" element={<LoginSrceen />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/setting" element={<Settings />}>
            <Route path="subscription" element={<SubscriptionPlan />} />
            <Route path="driver" element={<Driver />} />
            <Route path="role" element={<Role />} />
            <Route path="user" element={<User />} />
            <Route path="postcode" element={<PostCode />} />
          </Route>
          <Route path="/pickups" element={<Pickups />}>
            <Route path="subPickups" element={<SubPickups />} />
            <Route path="manage" element={<ManageSchedulePickups />} />
            <Route path="pickupsHistory" element={<PickupsHistory />} />
          </Route>
          <Route path="/store" element={<Store />}>
            <Route path="manageStore" element={<ManageStore />} />
            <Route path="wtns" element={<Wtns />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>
          <Route path="/forget" element={<ForgotPassword />}></Route>
          <Route path="/getotp" element={<GetOTPcomp />}></Route>
          <Route path="/resetpassword" element={<ResetPassword />}></Route>
        </Routes>
      </LocalizationProvider>
    </>
  );
};

export default App;
