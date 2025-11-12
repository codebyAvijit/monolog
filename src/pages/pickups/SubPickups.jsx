import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPickupsData } from "../../redux/pickupSlice";

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
  const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useDispatch();
  const { pickups, loading, error } = useSelector((state) => state.pickup);

  useEffect(() => {
    dispatch(fetchPickupsData({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
  };

  const columns = [
    { key: "requestId", label: "Request Id" },
    { key: "pickupLocation", label: "Pick-up Location" },
    { key: "numberOfTyres", label: "No Of Tyres" },
    { key: "pickupDate", label: "Pickup Date" },
    { key: "requestType", label: "Request Type" },
    {
      key: "status",
      label: "Status",
      render: (val, row) => {
        const displayVal = val ?? "N/A";
        let classes = "";
        if (displayVal === "Requested") classes = "bg-gray-200 text-black";
        else if (displayVal === "Completed")
          classes = "bg-green-100 text-green-700";
        else classes = "bg-sky-100 text-sky-700";
        return (
          <span
            className={`inline-block px-2 py-1 text-center text-xs md:text-sm font-[700] min-w-[80px] md:min-w-[95px] h-[28px] md:h-[30px] rounded-[30px] ${classes}`}
          >
            {displayVal}
          </span>
        );
      },
    },
    {
      label: "View Invoice",
      render: (el, row) =>
        row?.status?.toLowerCase() === "completed" && row?.invoiceFilePath ? (
          <NavLink
            to={row.invoiceFilePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
          >
            View Invoice
          </NavLink>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      label: "View WTN",
      render: (el, row) =>
        row?.status?.toLowerCase() === "completed" && row?.wtnFilePath ? (
          <NavLink
            to={row.wtnFilePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
          >
            View WTN
          </NavLink>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  // Dummy data
  const data = [
    {
      requestId: "REQ-1001",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "Arrived",
      requestType: "Standard",
      numberOfTyres: 30,
    },
    {
      requestId: "REQ-1002",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDate: "05/09/2025",
      status: "En-route",
      requestType: "Ad-hoc",
      numberOfTyres: 30,
    },
    {
      requestId: "REQ-1003",
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
      {/* Filters Section */}
      <div
        className="w-full mx-auto max-w-[1800px] px-4 md:px-8"
        style={{ marginTop: "clamp(24px, 2vh, 36px)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          <div className="my-rsuite w-[100%]">
            <DateRangePicker
              placeholder=":"
              className="custom-date-range"
              format="dd/MM/yyyy"
              showOneCalendar
              style={{ width: "100%", height: 60 }}
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
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg mx-auto max-w-[1800px] px-4 md:px-8"
        style={{ marginTop: "clamp(20px, 2vh, 32px)" }}
      >
        <TableDataComp
          columns={columns}
          data={pickups}
          actions={actions}
          loading={loading}
        />
      </div>

      {/* View Dialog */}
      <Dialog
        disableRestoreFocus
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              width: { xs: "95%", sm: "90%", md: "clamp(820px, 65vw, 1100px)" },
              margin: { xs: "12px", sm: "24px auto" },
              borderRadius: "14px",
              maxHeight: { xs: "90vh", sm: "85vh" },
              overflowY: "auto",
              overflowX: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: { xs: "16px", md: "18px", lg: "20px" },
            color: "#012622",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            borderBottom: "1px solid #E5E7EB",
            pb: 2,
            gap: 2,
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm md:text-base lg:text-lg">
              Pick-up Details - {selectedRow?.requestId}
            </span>
            {selectedRow && (
              <span
                className={`inline-block px-2 py-1 text-center text-xs md:text-sm font-[700] min-w-[80px] md:min-w-[97px] h-[28px] md:h-[30px] rounded-[30px] ${
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
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#012622",
              alignSelf: { xs: "flex-end", sm: "center" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
          {viewMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Request ID", value: selectedRow?.requestId || "" },
                {
                  label: "Pick-up Location",
                  value: selectedRow?.pickupLocation || "",
                },
                {
                  label: "Number of Tyres",
                  value: selectedRow?.numberOfTyres || "",
                },
                { label: "Pick-up Date", value: selectedRow?.pickupDate || "" },
                {
                  label: "Request Type",
                  value: selectedRow?.requestType || "",
                },
                { label: "Driver Name", value: "John Smith" },
                { label: "Vehicle Number", value: "PZ65 ABC" },
                {
                  label: "Invoice",
                  value:
                    selectedRow?.status?.toLowerCase() === "completed" &&
                    selectedRow?.invoiceFilePath ? (
                      <NavLink
                        to={selectedRow.invoiceFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
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
                    selectedRow?.status?.toLowerCase() === "completed" &&
                    selectedRow?.wtnFilePath ? (
                      <NavLink
                        to={selectedRow.wtnFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
                      >
                        View WTN
                      </NavLink>
                    ) : (
                      <span className="text-gray-400">-</span>
                    ),
                },
              ].map((item, i) => (
                <div key={i} className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
                    {item.label}
                  </p>
                  <h6 className="text-sm md:text-base font-semibold text-gray-900 break-words">
                    {item.value}
                  </h6>
                </div>
              ))}
            </div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <ButtonComp
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: "120px" },
              height: { xs: "45px", sm: "50px" },
              fontSize: { xs: "14px", sm: "16px" },
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
