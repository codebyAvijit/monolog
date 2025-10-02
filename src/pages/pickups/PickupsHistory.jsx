import React, { useState } from "react";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import { DateRangePicker } from "rsuite";
// importing rsuite styles
import "rsuite/dist/rsuite-no-reset.min.css";
import "./dateRangePicker.css";
import { NavLink } from "react-router-dom";

const pdfURL =
  "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

const wtnURL =
  "https://www.scribd.com/document/842007375/WTN-Waste-Transfer-Note-En-Updated";

const PickupsHistory = () => {
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [filterRouteId, setFilterRouteId] = useState("");
  const [filterDriverName, setFilterDriverName] = useState("");
  const [filterVehicleNumber, setFilterVehicleNumber] = useState("");

  //to show status as a span in view mode

  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false); // reset back
  };

  const columns = [
    {
      key: "tripId",
      label: "Trip ID",
    },
    {
      key: "driverName",
      label: "Driver Name",
    },
    {
      key: "vehicleNumber",
      label: "Vehicle Number",
    },
    {
      key: "tripStartDateTime",
      label: "Trip Start Date & Time",
    },
    {
      key: "tripEndDateTime",
      label: "Trip End Date & Time",
    },
    {
      key: "totalPickupLocation",
      label: "Total Pick-up Locations",
    },
    {
      key: "totalTyresCollected",
      label: "Total Tyres Collected",
    },
    {
      key: "mileage",
      label: "Mileage (kilometre)",
    },
    {
      key: "weighmentSlip",
      label: "Weighment Slip",
    },
    {
      key: "tripDuration",
      label: "Trip Duration",
    },
  ];
  const data = [
    {
      tripId: "ROUTE-2001",
      driverName: "John Smith",
      vehicleNumber: "LX20 BCD",
      tripStartDateTime: "10/09/2025, 08:30 AM",
      tripEndDateTime: "10/09/2025, 12:45 PM",
      totalPickupLocation: "3 stores",
      totalTyresCollected: "30",
      mileage: "70",
      weighmentSlip: (
        <NavLink
          to={pdfURL}
          target="_blank"
          state={{ row: selectedRow }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          slip_weight.pdf
        </NavLink>
      ),
      tripDuration: "4:15 Hours",
    },
    {
      tripId: "ROUTE-2002",
      driverName: "John Smith",
      vehicleNumber: "LX20 BCD",
      tripStartDateTime: "10/09/2025, 08:30 AM",
      tripEndDateTime: "10/09/2025, 12:45 PM",
      totalPickupLocation: "3 stores",
      totalTyresCollected: "130",
      mileage: "70",
      weighmentSlip: (
        <NavLink
          to={pdfURL}
          target="_blank"
          state={{ row: selectedRow }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          slip_weight.pdf
        </NavLink>
      ),
      tripDuration: "4:15 Hours",
    },
    {
      tripId: "ROUTE-2003",
      driverName: "John Smith",
      vehicleNumber: "LX20 BCD",
      tripStartDateTime: "10/09/2025, 08:30 AM",
      tripEndDateTime: "10/09/2025, 12:45 PM",
      totalPickupLocation: "3 stores",
      totalTyresCollected: "30",
      mileage: "30",
      weighmentSlip: (
        <NavLink
          to={pdfURL}
          target="_blank"
          state={{ row: selectedRow }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          slip_weight.pdf
        </NavLink>
      ),
      tripDuration: "4:15 Hours",
    },
  ];
  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => {
        setViewMode(true);
        setOpen(true);
        setSelectedRow(row);
      },
    },
  ];

  const columnForModalPickupDetail = [
    {
      key: "storeName",
      label: "Store Name",
    },
    {
      key: "pickupAddress",
      label: "Pick-up Address",
    },
    {
      key: "pickupDateTime",
      label: "Pick-up Date & Time",
    },
    {
      key: "tyresCollected",
      label: "Tyres Collected",
    },
    {
      key: "requestType",
      label: "Request Type",
    },
    {
      key: "invoice",
      label: "",
    },
    {
      key: "wtn",
      label: "",
    },
  ];
  const dataForModalPickupDetail = [
    {
      storeName: "Store 1",
      pickupAddress: "47 Baker Street, London, W1U 8ED",
      pickupDateTime: "05/09/2025",
      tyresCollected: "110",
      requestType: "Standard",
      invoice: (
        <NavLink
          to={pdfURL}
          target="_blank"
          state={{ row: selectedRow }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          View Invoice
        </NavLink>
      ),
      wtn: (
        <NavLink
          to={wtnURL}
          target="_blank"
          state={{ row: selectedRow }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          View WTN
        </NavLink>
      ),
    },
  ];

  //   const actionForModalPickupDetail = [
  //     {
  //       icon: "hi",
  //       label: "View",
  //       onClick: (row) => {
  //         setViewMode(true);
  //         setOpen(true);
  //         setSelectedRow(row);
  //       },
  //     },
  //   ];

  return (
    <>
      <div className="flex flex-wrap justify-between gap-5">
        <div className="my-rsuite">
          <DateRangePicker
            placeholder=":"
            className="custom-date-range"
            format="dd/MM/yyyy"
            showOneCalendar
            style={{ width: 334, height: 60 }}
            label="Select Date"
          />
        </div>
        <SelectMenuComp
          label="Route ID"
          name="filterRouteId"
          value={filterRouteId}
          onChange={(e) => setFilterRouteId(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "Route-2001", label: "Route-2001" },
            { value: "Route-2002", label: "Route-2002" },
            { value: "Route-2003", label: "Route-2003" },
            { value: "Route_2004", label: "Route_2004" },
          ]}
        />
        <SelectMenuComp
          label="Driver Name"
          name="filterDriverName"
          value={filterDriverName}
          onChange={(e) => setFilterDriverName(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "John", label: "John" },
            { value: "Doe", label: "Doe" },
            { value: "Sarah", label: "Sarah" },
            { value: "Cahan", label: "Cahan" },
          ]}
        />
        <SelectMenuComp
          label="Vehicle Number"
          name="filterVehicleNumber"
          value={filterVehicleNumber}
          onChange={(e) => setFilterVehicleNumber(e.target.value)}
          options={[
            { value: "LX20 BCD", label: "LX20 BCD" },
            { value: "LX20 BCD", label: "LX20 BCD" },
            { value: "LX20 BCD", label: "LX20 BCD" },
            { value: "LX20 BCD", label: "LX20 BCD" },
            { value: "LX20 BCD", label: "LX20 BCD" },
          ]}
        />
        <SearchBarComp />
      </div>
      <div className="mt-5">
        <TableDataComp columns={columns} data={data} actions={actions} />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        disableRestoreFocus
        PaperProps={{
          sx: {
            maxWidth: "1177px",
            borderRadius: "12px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Title */}
        <DialogTitle
          sx={{
            fontWeight: "600",
            fontSize: "20px",
            color: "#012622",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E5E7EB",
            pb: 2,
          }}
        >
          {/* ✅ Wrap heading + status pill together */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span>Pick-up Details - {selectedRow?.requestId}</span>
            {selectedRow && (
              <span className="inline-block px-2 py-1 text-center text-[16px] font-[700] w-[97px] h-[30px] rounded-[30px] bg-green-100 text-green-700">
                Completed
              </span>
            )}
          </div>

          {/* <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span>Pick-up Details - {selectedRow?.tripId}</span>
            {selectedRow && (
              <span
                className={`inline-block px-2 py-1 text-center text-[16px] font-[700] w-[97px] h-[30px] rounded-[30px] ${
                  selectedRow.status === "Requested"
                    ? "bg-gray-200 text-black"
                    : selectedRow.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-sky-100 text-sky-700"
                }`}
              >
                {selectedRow.status}
              </span>
            )}
          </div> */}

          {/* ❌ Close button stays on the right */}
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            mt: 2,
          }}
        >
          {viewMode && (
            <>
              {/* Store Info */}

              <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { label: "Trip ID", value: selectedRow?.tripId },
                  { label: "Driver Name", value: selectedRow?.driverName },
                  {
                    label: "Vehicle Number",
                    value: selectedRow?.vehicleNumber,
                  },
                  {
                    label: "Trip Start Date & Time (first pick-up)",
                    value: selectedRow?.tripStartDateTime,
                  },
                  {
                    label: "Trip End Date & Time (delivery at recycle plant)",
                    value: selectedRow?.tripEndDateTime,
                  },
                  {
                    label: "Total Tyres Collected",
                    value: selectedRow?.totalTyresCollected,
                  },
                  { label: "Mileage (kilometre)", value: selectedRow?.mileage },
                  {
                    label: "Total Duration (hours)",
                    value: selectedRow?.tripDuration,
                  },
                  {
                    label: "Weighment Slip",
                    value: selectedRow ? (
                      <NavLink
                        to={pdfURL}
                        target="_blank"
                        className="text-[rgba(233,138,21,1)] hover:text-black underline"
                      >
                        Weighment Slip
                      </NavLink>
                    ) : (
                      <span className="text-gray-400">-</span>
                    ),
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-[14px] font-medium text-gray-600">
                      {item.label}
                    </p>
                    <h6 className="text-[16px] font-semibold text-gray-900">
                      {item.value}
                    </h6>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  Pick-up Details (Per Store)
                </h2>
                <TableDataComp
                  columns={columnForModalPickupDetail}
                  data={dataForModalPickupDetail}
                  //   actions={actionForModalPickupDetail}
                />
              </div>
              <h2 className="text-lg font-semibold mb-2">
                Delivery Details (Recycle Plant)
              </h2>
              <div className="mb-6 flex justify-between">
                {[
                  { label: "Recycle Plant Name", value: "Recycle Hub" },
                  {
                    label: "Arrival Time at Plant",
                    value: "03/07/2025, 04:00 PM",
                  },
                  {
                    label: "Total Tyres Delivered",
                    value: "470",
                  },
                ].map((item, i) => {
                  return (
                    <div key={i}>
                      <p className="text-[14px] font-medium text-gray-600">
                        {item.label}
                      </p>
                      <h6 className="text-[16px] font-semibold text-gray-900">
                        {item.value}
                      </h6>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 2 }}>
          <ButtonComp
            variant="outlined"
            sx={{
              width: "120px",
              height: "50px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
            onClick={handleClose}
          >
            Close
          </ButtonComp>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PickupsHistory;
