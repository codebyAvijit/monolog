// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Nav from "../../layouts/Nav";
import TabNavigation from "./TabNavigation";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import StatsCard from "./StatsCard";
import partner from "../../assets/icons/partner.svg";
import car from "../../assets/icons/car.svg";
import driver from "../../assets/icons/driver.svg";
import tyre from "../../assets/icons/tyre.svg";
import revenue from "../../assets/icons/revenue.svg";
import IssueCard from "./IssueCard";
import SubscriptionsCard from "./SubscriptionCard";
import RevenueChart from "./RevenueChart";
import BarChartCard from "./RecycledBarChart";

import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../redux/dashboardSlice";

const Dashboard = () => {
  // Top-level tab state, default to "Today"
  const [topActiveTab, setTopActiveTab] = useState("Today");
  // Revenue chart internal tab state, separate from topActiveTab
  const [revenueActiveTab, setRevenueActiveTab] = useState("Month");

  const dispatch = useDispatch();
  const { data: dashboardData, loading: dashboardLoading } = useSelector(
    (state) => state.dashboard
  );

  // Map UI tab labels to API 'period' values
  const periodMap = {
    Today: "today",
    Month: "month",
    Year: "year",
  };

  // Fetch dashboard on mount and whenever topActiveTab changes
  useEffect(() => {
    const period = periodMap[topActiveTab] || "today";
    dispatch(fetchDashboardData(period));
  }, [dispatch, topActiveTab]);

  // Build statsData from API response while preserving UI layout and texts.
  const statsData = [
    {
      icon: partner,
      title: "Number of partner stores",
      value: dashboardData?.partners ?? 0,
      type: "",
    },
    {
      icon: car,
      title: "Number of pick-ups scheduled today",
      // If you want this tile to reflect period-aware value you can change it later.
      value: dashboardData?.pickups ?? 0,
      type: "",
    },
    {
      icon: driver,
      title: "Drivers assigned for pickup today",
      value: dashboardData?.drivers_assigned ?? 0,
    },
    {
      icon: tyre,
      title: `Number of tyres already picked-up/\nNumber of tyres to be picked-up`,
      value: `${dashboardData?.tyres_picked ?? 0}/${
        dashboardData?.total_tyres ?? 0
      }`,
    },
    {
      icon: "",
      title: "WTNs E-signed",
      value: dashboardData?.wtns ?? 0,
      type: "highlight-green",
      showArrow: true,
    },
    {
      icon: revenue,
      title: "Revenue",
      value: `£${dashboardData?.revenue ?? 0}`,
      type: "highlight-blue",
    },
  ];

  // sample table columns (unchanged)
  const tableColumns = [
    { key: "driver", label: "Driver" },
    { key: "store", label: "Store" },
    { key: "pickupLocation", label: "Pick-up Location" },
    { key: "status", label: "Status" },
    { key: "flag", label: "Flag/Safety Stop" },
    { key: "chat", label: "Chat" },
  ];

  // sample static table data unchanged
  const tableData = [
    {
      id: 1,
      driver: "John",
      store: "Morrisons",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      status: "Arrived",
      flag: "Safety Stop Raised",
      chat: "Chat Now",
    },
    {
      id: 2,
      driver: "Erwin",
      store: "Waitrose",
      pickupLocation: "12 High Street, Manchester, M1 4AB",
      status: "En-route",
      flag: "Flag Raised",
      chat: "Chat Now",
    },
    {
      id: 3,
      driver: "Jack",
      store: "Sainsbury",
      pickupLocation: "88 King's Road, Birmingham, B15 2TH",
      status: "En-route",
      flag: "No Flag/Safety Stop Raised",
      chat: "Chat Now",
    },
    {
      id: 4,
      driver: "Jacob",
      store: "Lorem",
      pickupLocation: "88 King's Road, Birmingham, B15 2TH",
      status: "En-route",
      flag: "No Flag/Safety Stop Raised",
      chat: "Chat Now",
    },
  ];

  return (
    <>
      <Nav />

      <div className="p-8 space-y-8">
        {/* Top Tabs */}
        <div className="mt-5">
          <TabNavigation
            tabs={["Today", "Month", "Year"]}
            activeTab={topActiveTab}
            setActiveTab={setTopActiveTab}
            insideGrid={true}
            topNavFontSize={true}
          />
        </div>

        {/* Stats Cards row */}
        <StatsCard stats={statsData} height={130} />

        {/* Middle row: Issue card, Subscriptions, Revenue chart */}
        <div className="w-full">
          <div className="flex justify-between gap-6 flex-col lg:flex-row">
            {/* Left: IssueCard - conditionally shown only when top tab is Today */}
            {topActiveTab === "Today" && (
              <div className="w-full lg:w-1/4">
                <IssueCard
                  dataFlag={[
                    { driver: "John", issue: "Breakdown", issueLink: "#" },
                    { driver: "Erwin", issue: "Tyre Puncture", issueLink: "#" },
                  ]}
                  dataStops={[
                    { driver: "Alice", issue: "Rest Needed", issueLink: "#" },
                  ]}
                />
              </div>
            )}

            {/* Middle: Subscriptions - adjusts width based on top tab */}
            <div
              className={`w-full ${
                topActiveTab === "Today" ? "lg:w-2/4" : "lg:w-1/2"
              }`}
            >
              <SubscriptionsCard
                active={dashboardData?.subscriptions?.active ?? 0}
                due={dashboardData?.subscriptions?.expired ?? 0}
                low={dashboardData?.subscriptions?.expiring_soon ?? 0}
              />
            </div>

            {/* Right: Revenue chart - adjusts width based on top tab */}
            <div
              className={`w-full ${
                topActiveTab === "Today" ? "lg:w-2/4" : "lg:w-1/2"
              }`}
            >
              <div className="h-full">
                <RevenueChart
                  value={`£${dashboardData?.revenue ?? 0}`}
                  lineData={[
                    1000, 4000, 5000, 7000, 12000, 9000, 15000, 13000, 20000,
                  ]}
                  categories={[1, 5, 10, 15, 20, 22, 25, 27, 30]}
                  activeTab={revenueActiveTab}
                  setActiveTab={setRevenueActiveTab}
                  height="170px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <BarChartCard
                type="recycled"
                value={2250}
                barData={[600, 750, 1500, 1100]}
                categories={["Week 1", "Week 2", "Week 3", "Week 4"]}
                dateValue={new Date()}
                onDateChange={(d) => console.log("recycled date", d)}
                height={320}
              />
            </div>

            <div className="w-full md:w-1/2">
              <BarChartCard
                type="co2"
                value={80}
                barData={[300, 750, 1500, 1000]}
                categories={["Week 1", "Week 2", "Week 3", "Week 4"]}
                dateValue={new Date()}
                onDateChange={(d) => console.log("co2 date", d)}
                height={320}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow p-2 md:p-4 overflow-x-auto">
            <div className="mb-2 px-2 md:px-0">
              <h3 className="text-lg font-bold">Today's Pick-ups Schedule</h3>
            </div>
            <TableDataComp
              columns={tableColumns}
              data={tableData}
              actions={[]} // or pass actions
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
