// Import necessary libraries and components
import React from "react";
import Nav from "../../layouts/Nav";

const Dashboard = () => {
  return (
    <>
      <Nav />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to Dashboard 🎉</h1>
      </div>
    </>
  );
};

export default Dashboard;
