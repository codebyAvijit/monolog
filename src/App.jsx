import LoginSrceen from "./components/LoginSrceen";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Pickups from "./components/Pickups";
import Customer from "./components/Customer";
import SubscriptionPlan from "./components/SubscriptionPlan";
import Driver from "./components/Driver";
import Role from "./components/Role";
import User from "./components/User";
import PostCode from "./components/PostCode";
import ForgotPassword from "./components/ForgotPassword";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";
import GetOTPcomp from "./components/GetOTPcomp";
import ResetPassword from "./components/ResetPassword";
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
          <Route path="/pickups" element={<Pickups />}></Route>
          <Route path="/customer" element={<Customer />}></Route>
          <Route path="/forget" element={<ForgotPassword />}></Route>
          <Route path="/getotp" element={<GetOTPcomp />}></Route>
          <Route path="/resetpassword" element={<ResetPassword />}></Route>
        </Routes>
      </LocalizationProvider>
    </>
  );
};

export default App;
