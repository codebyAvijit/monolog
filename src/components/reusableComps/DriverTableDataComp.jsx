import React, { useState } from "react";
import TableDataComp from "./TableDataComp";
import infoIcon from "../../assets/icons/info.svg";
import searchIcon from "../../assets/icons/search.svg";

const DriverTableDataComp = ({ requests = [], actions = [] }) => {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [driverAssignments, setDriverAssignments] = useState({});

  const handleInfoClick = (rowId) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  };

  // Group drivers
  const groupedDrivers = requests.reduce((acc, request) => {
    if (!acc[request.driverId]) {
      acc[request.driverId] = {
        driverId: request.driverId,
        driverName: request.driverName,
        vehicleName: request.vehicleName,
        maxCapacity: request.maxCapacity,
        selectedTyres: request.selectedTyres,
      };
    }
    return acc;
  }, {});

  const drivers = Object.values(groupedDrivers).filter((driver) =>
    driver.driverName.toLowerCase().includes(search.toLowerCase())
  );

  // Check if any driver is selected
  const isAnyDriverSelected = selectedDriverId !== null;

  const columns = [
    {
      key: "driverInfo",
      label: (
        <div className="flex items-center">
          <input
            type="search"
            placeholder="Search Driver..."
            className="w-full rounded-md px-2 py-1 outline-none focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={searchIcon} alt="search" className="w-4 h-4" />
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="selectedDriver"
            checked={selectedDriverId === row.driverId}
            onChange={() => setSelectedDriverId(row.driverId)}
            className="accent-black w-5 h-5"
          />
          <span className="font-medium">{row.driverName}</span>

          <div className="relative ml-2">
            <button
              onMouseOver={() => handleInfoClick(row.driverId)}
              onMouseLeave={() => setExpandedRow(null)}
            >
              <img src={infoIcon} alt="info" className="w-4 h-4" />
            </button>

            {expandedRow === row.driverId && (
              <div
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 border rounded-md w-[225px] p-2 bg-[#414650] shadow-lg z-50 text-[14px] flex flex-col text-center
               before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 
               before:border-8 before:border-transparent before:border-t-[#414650]"
              >
                <span className="text-xs text-white">
                  Truck: {row.vehicleName}
                </span>
                <span className="text-xs text-white">
                  Max tyre capacity: {row.maxCapacity}
                </span>
                <span className="text-xs text-white">
                  Selected tyre count: {row.selectedTyres}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "requestId",
      label: "Request ID",
      render: (_, row) => {
        // Get all requests for this specific driver
        const driverRequests = requests.filter(
          (req) => req.driverId === row.driverId
        );

        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <label key={req.requestId} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={!isAnyDriverSelected}
                  checked={
                    driverAssignments[selectedDriverId]?.includes(
                      req.requestId
                    ) || false
                  }
                  onChange={() => {
                    if (!isAnyDriverSelected) return;

                    setDriverAssignments((prev) => {
                      const current = prev[selectedDriverId] || [];

                      if (current.includes(req.requestId)) {
                        return {
                          ...prev,
                          [selectedDriverId]: current.filter(
                            (id) => id !== req.requestId
                          ),
                        };
                      } else {
                        return {
                          ...prev,
                          [selectedDriverId]: [...current, req.requestId],
                        };
                      }
                    });
                  }}
                  className={`accent-[#003B36] w-[15px] h-[15px] rounded-[4px] ${
                    !isAnyDriverSelected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <span className={!isAnyDriverSelected ? "opacity-50" : ""}>
                  {req.requestId}
                </span>
              </label>
            ))}
          </div>
        );
      },
    },
    {
      key: "store",
      label: "Store",
      render: (_, row) => {
        const driverRequests = requests.filter(
          (req) => req.driverId === row.driverId
        );
        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={req.requestId}>{req.store}</div>
            ))}
          </div>
        );
      },
    },
    {
      key: "pickupLocation",
      label: "Pick-up Location",
      render: (_, row) => {
        const driverRequests = requests.filter(
          (req) => req.driverId === row.driverId
        );
        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={req.requestId}>{req.pickupLocation}</div>
            ))}
          </div>
        );
      },
    },
    {
      key: "pickupDateTime",
      label: "Pick-up Date & Time",
      render: (_, row) => {
        const driverRequests = requests.filter(
          (req) => req.driverId === row.driverId
        );
        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={req.requestId}>{req.pickupDateTime}</div>
            ))}
          </div>
        );
      },
    },
    {
      key: "requestType",
      label: "Request Type",
      render: (_, row) => {
        const driverRequests = requests.filter(
          (req) => req.driverId === row.driverId
        );
        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={req.requestId}>{req.requestType}</div>
            ))}
          </div>
        );
      },
    },
    {
      key: "tyres",
      label: "Tyres",
      render: (_, row) => {
        const driverRequests = requests.filter(
          (req) => req.driverId === row.driverId
        );
        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={req.requestId}>{req.tyres}</div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <TableDataComp
      columns={columns}
      data={drivers}
      actions={actions}
      showRightBorder={true} //  right border only for this table
      bottomBorderColor="border-gray-200" //  very light grey bottom border
    />
  );
};

export default DriverTableDataComp;
