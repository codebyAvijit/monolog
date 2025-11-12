import React, { useState, useMemo } from "react";
import TableDataComp from "./TableDataComp";
import infoIcon from "../../assets/icons/info.svg";
import searchIcon from "../../assets/icons/search.svg";

const DriverTableDataComp = ({
  drivers = [],     // array of driver metadata objects
  pickups = [],     // array of all pickup requests
  actions = [],
  selectedDriverId,
  setSelectedDriverId,
  driverAssignments,
  setDriverAssignments,
}) => {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // Tooltip toggle
  const handleInfoClick = (rowId) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  };

  // Filter drivers by search term
  const filteredDrivers = useMemo(
    () =>
      drivers
        .filter((d) =>
          (d.driverName || "")
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((d) => ({
          driverId: d.driverId,
          driverName: d.driverName,
          vehicleName: d.vehicleName,
          maxCapacity: d.maxCapacity,
          selectedTyres: d.selectedTyres || 0,
        })),
    [drivers, search]
  );

  // Toggle radio selection (click again to unselect)
  const handleRadioToggle = (driverId) => {
    setSelectedDriverId((prev) => (prev === driverId ? null : driverId));
  };

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
          <img src={searchIcon} alt="search" className="w-4 h-4 ml-2" />
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="selectedDriver"
            checked={selectedDriverId === row.driverId}
            onClick={() => handleRadioToggle(row.driverId)}
            readOnly
            className="accent-black w-5 h-5 cursor-pointer"
          />
          <span className="font-medium">{row.driverName}</span>

          {/* Info Tooltip */}
          <div className="relative ml-2">
            <button
              onMouseOver={() => handleInfoClick(row.driverId)}
              onMouseLeave={() => setExpandedRow(null)}
            >
              <img src={infoIcon} alt="info" className="w-4 h-4" />
            </button>

            {expandedRow === row.driverId && (
              <div
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 border rounded-md w-[225px] p-2 bg-[#414650] shadow-lg z-50 text-[13px] flex flex-col text-center
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

    //  Request IDs column
    {
      key: "requestId",
      label: "Request ID",
      render: (_, row) => {
        // driverRequests — include pickups that already belong to this driver
        // and include unassigned pickups (no driverId) so user can assign them
        const driverRequests = pickups.filter(
          (p) =>
            (p.driverId && p.driverId.toLowerCase() === row.driverId.toLowerCase()) ||
            (!p.driverId || p.driverId === null || p.driverId === undefined)
        );

        if (!selectedDriverId)
          return (
            <p className="text-gray-400 text-sm italic">
              Select a driver to view requests
            </p>
          );

        return (
          <div className="flex flex-col gap-1">
            {driverRequests.length === 0 && (
              <p className="text-gray-400 italic text-sm">No requests found</p>
            )}

            {driverRequests.map((req) => (
              <label
                key={`req-${row.driverId}-${req.requestId}`}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  disabled={selectedDriverId !== row.driverId}
                  checked={
                    driverAssignments[row.driverId]?.includes(req.requestId) ||
                    // if pickup already assigned to this driver, show checked
                    (req.driverId &&
                      req.driverId.toLowerCase() === row.driverId.toLowerCase())
                  }
                  onChange={() => {
                    setDriverAssignments((prev) => {
                      const current = prev[row.driverId] || [];
                      if (current.includes(req.requestId)) {
                        return {
                          ...prev,
                          [row.driverId]: current.filter(
                            (id) => id !== req.requestId
                          ),
                        };
                      } else {
                        return {
                          ...prev,
                          [row.driverId]: [...current, req.requestId],
                        };
                      }
                    });
                  }}
                  className={`accent-[#003B36] w-[15px] h-[15px] rounded-[4px] ${
                    selectedDriverId !== row.driverId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                />
                <span
                  className={
                    selectedDriverId !== row.driverId ? "opacity-50" : ""
                  }
                >
                  {req.requestId}
                </span>
              </label>
            ))}
          </div>
        );
      },
    },

    //  Pickup Location
    {
      key: "pickupLocation",
      label: "Pick-up Location",
      render: (_, row) => {
        const driverRequests = pickups.filter(
          (p) =>
            (p.driverId && p.driverId.toLowerCase() === row.driverId.toLowerCase()) ||
            (!p.driverId || p.driverId === null || p.driverId === undefined)
        );
        if (!selectedDriverId)
          return <p className="text-gray-400 italic text-sm">N/A</p>;

        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={`loc-${row.driverId}-${req.requestId}`}>
                {req.pickupLocation || "—"}
              </div>
            ))}
          </div>
        );
      },
    },

    //  Pickup Date & Time
    {
      key: "pickupDateTime",
      label: "Pick-up Date & Time",
      render: (_, row) => {
        const driverRequests = pickups.filter(
          (p) =>
            (p.driverId && p.driverId.toLowerCase() === row.driverId.toLowerCase()) ||
            (!p.driverId || p.driverId === null || p.driverId === undefined)
        );
        if (!selectedDriverId)
          return <p className="text-gray-400 italic text-sm">N/A</p>;

        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={`date-${row.driverId}-${req.requestId}`}>
                {req.pickupDateTime || "—"}
              </div>
            ))}
          </div>
        );
      },
    },

    //  Request Type
    {
      key: "requestType",
      label: "Request Type",
      render: (_, row) => {
        const driverRequests = pickups.filter(
          (p) =>
            (p.driverId && p.driverId.toLowerCase() === row.driverId.toLowerCase()) ||
            (!p.driverId || p.driverId === null || p.driverId === undefined)
        );
        if (!selectedDriverId)
          return <p className="text-gray-400 italic text-sm">N/A</p>;

        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={`type-${row.driverId}-${req.requestId}`}>
                {req.requestType || "—"}
              </div>
            ))}
          </div>
        );
      },
    },

    //  Tyres count
    {
      key: "tyres",
      label: "Tyres",
      render: (_, row) => {
        const driverRequests = pickups.filter(
          (p) =>
            (p.driverId && p.driverId.toLowerCase() === row.driverId.toLowerCase()) ||
            (!p.driverId || p.driverId === null || p.driverId === undefined)
        );
        if (!selectedDriverId)
          return <p className="text-gray-400 italic text-sm">N/A</p>;

        return (
          <div className="flex flex-col gap-1">
            {driverRequests.map((req) => (
              <div key={`tyre-${row.driverId}-${req.requestId}`}>
                {req.tyres ?? 0}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <TableDataComp
      columns={columns}
      data={filteredDrivers}
      actions={actions}
      showRightBorder={true}
      bottomBorderColor="border-gray-200"
    />
  );
};

export default DriverTableDataComp;
