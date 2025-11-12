import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPickupHistoryData } from "../../redux/pickupHistorySlice";
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

const PickupsHistory = () => {
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [filterRouteId, setFilterRouteId] = useState("");
  const [filterDriverName, setFilterDriverName] = useState("");
  const [filterVehicleNumber, setFilterVehicleNumber] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useDispatch();
  const { pickupHistory, loading, error } = useSelector(
    (state) => state.pickupHistory
  );

  useEffect(() => {
    dispatch(fetchPickupHistoryData({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const columns = [
    { key: "tripId", label: "Trip ID" },
    { key: "driverName", label: "Driver Name" },
    { key: "vehicleNumber", label: "Vehicle Number" },
    { key: "tripStartDateTime", label: "Trip Start Date & Time" },
    { key: "tripEndDateTime", label: "Trip End Date & Time" },
    { key: "totalPickupLocation", label: "Total Pick-up Locations" },
    { key: "totalTyresCollected", label: "Total Tyres Collected" },
    { key: "mileage", label: "Mileage (kilometre)" },
    { key: "weighmentSlip", label: "Weighment Slip" },
    { key: "tripDuration", label: "Trip Duration" },
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
          className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
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
          className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
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
          className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
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
    { key: "storeName", label: "Store Name" },
    { key: "pickupAddress", label: "Pick-up Address" },
    { key: "pickupDateTime", label: "Pick-up Date & Time" },
    { key: "tyresCollected", label: "Tyres Collected" },
    { key: "requestType", label: "Request Type" },
    { key: "invoice", label: "" },
    { key: "wtn", label: "" },
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
          className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
        >
          View Invoice
        </NavLink>
      ),
      wtn: (
        <NavLink
          to={wtnURL}
          target="_blank"
          className="text-[rgba(233,138,21,1)] hover:text-black underline text-xs md:text-sm"
        >
          View WTN
        </NavLink>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
  };

  return (
    <>
      {/* Filters Section */}
      <div className="w-full mx-auto max-w-[1800px] px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          <div className="my-rsuite">
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg mx-auto max-w-[1800px] px-4 md:px-8 mt-6">
        <TableDataComp
          columns={columns}
          data={pickupHistory}
          actions={actions}
          loading={loading}
        />
      </div>

      {/* View Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        disableRestoreFocus
        maxWidth="xl"
        slotProps={{
          paper: {
            sx: {
              width: { xs: "95%", sm: "90%", md: "clamp(820px, 70vw, 1200px)" },
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
              Trip Details - {selectedRow?.tripId}
            </span>
            {selectedRow && (
              <span className="inline-block px-3 py-1 text-center text-xs md:text-sm font-bold rounded-[30px] bg-green-100 text-green-700">
                Completed
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
            <>
              {/* Trip Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
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
                    label: "Total Pick-up Locations",
                    value: selectedRow?.totalPickupLocation,
                  },
                  {
                    label: "Total Tyres Collected",
                    value: selectedRow?.totalTyresCollected,
                  },
                  { label: "Mileage (kilometre)", value: selectedRow?.mileage },
                  { label: "Trip Duration", value: selectedRow?.tripDuration },
                  {
                    label: "Weighment Slip",
                    value: selectedRow?.weighmentSlip,
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
                      {item.label}
                    </p>
                    <h6 className="text-sm md:text-base font-semibold text-gray-900 break-words">
                      {item.value}
                    </h6>
                  </div>
                ))}
              </div>

              {/* Pick-up Details */}
              <div className="mb-6">
                <h2 className="text-base md:text-lg font-semibold mb-3 text-[#012622]">
                  Pick-up Details (Per Store)
                </h2>
                <TableDataComp
                  columns={columnForModalPickupDetail}
                  data={dataForModalPickupDetail}
                />
              </div>
            </>
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

export default PickupsHistory;
