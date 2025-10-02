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

const SubPickups = () => {
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [filterStatusType, setFilterStatusType] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterStoreType, setFilterStoreType] = useState("");

  //to show status as a span in view mode

  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false); // reset back
  };

  const columns = [
    {
      key: "requestId",
      label: "Request Id",
    },
    {
      key: "pickupLocation",
      label: "Pick-up Location",
    },
    {
      key: "numberOfTyres",
      label: "No Of Tyres",
    },
    {
      key: "pickupDate",
      label: "Pickup Date",
    },
    {
      key: "status",
      label: "Status",
      render: (val, row) => {
        const displayVal = val ?? "N/A"; // fallback if undefined
        let classes = "";

        if (displayVal === "Requested") {
          classes = "bg-gray-200 text-black";
        } else if (displayVal === "Completed") {
          classes = "bg-green-100 text-green-700";
        } else {
          classes = "bg-sky-100 text-sky-700";
        }

        return (
          <span
            className={`inline-block px-2 py-1 text-center text-[16px] font-[700] w-[95px] h-[30px] rounded-[30px] ${classes}`}
          >
            {displayVal}
          </span>
        );
      },
    },
    {
      label: "View Invoice",
      render: (el, row) => {
        if (row?.status === "Completed") {
          return (
            <NavLink
              to={pdfURL}
              target="_blank"
              state={{ row }}
              className="text-[rgba(233,138,21,1)] hover:text-black underline"
            >
              View Invoice
            </NavLink>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      label: "View WTN",
      render: (el, row) => {
        // console.log("Row status:", row?.status);
        if (row?.status === "Completed") {
          return (
            <NavLink
              to={wtnURL}
              target="_blank"
              state={{ row }}
              className="text-[rgba(233,138,21,1)] hover:text-black underline"
            >
              View WTN
            </NavLink>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
  ];

  const data = [
    {
      requestId: "REQ-1001",
      //   store: "Emily",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "Arrived",
      requestType: "Standard",
      numberOfTyres: 30,
    },
    {
      requestId: "REQ-1002",
      //   store: "Sarah",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "En-route",
      requestType: "Ad-hoc",
      numberOfTyres: 30,
    },
    {
      requestId: "REQ-1003",
      //   store: "Raj",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "Requested",
      requestType: "Express",
      numberOfTyres: 30,
    },
    {
      requestId: "REQ-1004",
      store: "Raj",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "Scheduled",
      requestType: "Express",
      numberOfTyres: 30,
    },
    {
      requestId: "REQ-1005",
      store: "Raj",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "Completed",
      requestType: "Express",
      numberOfTyres: 30,
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

  return (
    <>
      <div className="flex gap-5 flex-wrap justify-between">
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
          label="Status"
          name="filterStatusType"
          value={filterStatusType}
          onChange={(e) => setFilterStatusType(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "arrived", label: "Arrived" },
            { value: "enroute", label: "En-route" },
            { value: "scheduled", label: "Scheduled" },
            { value: "completed", label: "Completed" },
          ]}
        />
        <SelectMenuComp
          label="Request Type"
          name="filterRequestType"
          value={filterRequestType}
          onChange={(e) => setFilterRequestType(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "standard", label: "Standard" },
            { value: "adhoc", label: "Ad-hoc" },
            { value: "express", label: "Express" },
          ]}
        />
        <SelectMenuComp
          label="Store"
          name="filterStoreType"
          value={filterStoreType}
          onChange={(e) => setFilterStoreType(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "emily", label: "Emily" },
            { value: "raj", label: "Raj" },
            { value: "sarah", label: "Sarah" },
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
          </div>

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
                  { label: "Request ID", value: "1001" },
                  {
                    label: "Pick-up Location",
                    value: "47 Baker Street, London, W1U 8ED",
                  },
                  { label: "Number of Tyres", value: "40" },
                  { label: "Pick-up Date", value: "05/09/2025" },
                  {
                    label: "Request Type",
                    value: "Express",
                  },
                  {
                    label: "Driver Name",
                    value: "John Smith",
                  },
                  {
                    label: "Vehicle Number",
                    value: "PZ65 ABC",
                  },
                  {
                    label: "Invoice",
                    value:
                      selectedRow?.status === "Completed" ? (
                        <NavLink
                          to={pdfURL}
                          target="_blank"
                          state={{ row: selectedRow }}
                          className="text-[rgba(233,138,21,1)] hover:text-black underline"
                        >
                          View Invoice
                        </NavLink>
                      ) : (
                        <span className="text-gray-400">-</span>
                      ),
                  },
                  {
                    label: "WTN",
                    value:
                      selectedRow?.status === "Completed" ? (
                        <NavLink
                          to={wtnURL}
                          target="_blank"
                          state={{ row: selectedRow }}
                          className="text-[rgba(233,138,21,1)] hover:text-black underline"
                        >
                          View WTN
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

export default SubPickups;
