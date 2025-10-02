import React from "react";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import downloadIcon from "../../assets/icons/download.svg";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Invoices = () => {
  //   const location = useLocation();
  //   const row = location.state?.row; // ✅ access the row passed
  const [filterStore, setFilterStore] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);

  //useState to view a particular selected row

  const [selectedRow, setSelectedRow] = useState(null); // not in use as of now kept optional

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false); // reset back
  };
  const columns = [
    { key: "invoiceNumber", label: "Invoice Number" },
    { key: "store", label: "Store" },
    { key: "date", label: "Date" },
  ];

  const data = [
    {
      invoiceNumber: "INV001",
      store: "Morrisons",
      date: "28-8-2025",
    },
    {
      invoiceNumber: "INV001",
      store: "Morrisons",
      date: "28-8-2025",
    },
    {
      invoiceNumber: "INV001",
      store: "Morrisons",
      date: "28-8-2025",
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      // onClick: (row) => console.log("View", row),
      onClick: (row) => {
        setViewMode(true); // enable view mode
        setOpen(true); // open modal
        setSelectedRow(row);
      },
    },
    {
      icon: downloadIcon,
      label: "download",
      // onClick: (row) => console.log("View", row),
      onClick: (row) => {
        setViewMode(true); // enable view mode
        setOpen(true); // open modal
      },
    },
  ];
  return (
    <>
      <div className="flex gap-5">
        <SelectMenuComp
          label="Store"
          value={filterStore}
          onChange={(e) => setFilterStore(e.target.value)}
          options={[
            { value: "Morrisons", label: "Morrisons" },
            { value: "Waitrose", label: "Waitrose" },
            { value: "Sainsbury's", label: "Sainsbury's" },
          ]}
        />
        <DatePickerComp label="Date" />
        <SearchBarComp />
      </div>
      <div className="mt-5">
        <TableDataComp columns={columns} data={data} actions={actions} />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxWidth: "1177px",
              borderRadius: "12px",
              p: 3,
              maxHeight: "723px",
            },
          },
        }}
      >
        <DialogTitle
          className="flex flex-row justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]"
          sx={{ fontWeight: "600", fontSize: "20px", color: "#012622" }}
        >
          {selectedRow ? "Invoices" : ""}
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedRow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Invoice Number</p>
                <h6 className="text-lg font-semibold">
                  {selectedRow.invoiceNumber}
                </h6>
              </div>
              <div>
                <p className="text-sm text-gray-600">Store</p>
                <h6 className="text-lg font-semibold">{selectedRow.store}</h6>
              </div>

              <div>
                <p className="text-sm text-gray-600">Date</p>
                <h6 className="text-lg font-semibold">{selectedRow.date}</h6>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Invoices;
