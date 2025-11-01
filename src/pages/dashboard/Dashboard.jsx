// Import necessary libraries and components
import React from "react";
import Nav from "../../layouts/Nav";

const Dashboard = () => {
  return (
    <>
      <Nav />
      <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Welcome to Dashboard</h1>
      </div>
    </>
  );
};

export default Dashboard;
