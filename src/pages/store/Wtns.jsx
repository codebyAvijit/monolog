import React from "react";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import downloadIcon from "../../assets/icons/download.svg";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Wtns = () => {
  const [filterStore, setFilterStore] = useState("");
  const [viewMode, setViewMode] = useState(false);

  //useState to view a particular selected row

  const [selectedRow, setSelectedRow] = useState(null); // not in use as of now kept optional

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
    setSelectedRow(null); // clear selected row
  };

  const columns = [
    { key: "store", label: "Store" },
    { key: "driverName", label: "Driver" },
    { key: "wtnId", label: "WTN ID" },
    { key: "date", label: "Date" },
    { key: "numberOfTyres", label: "Number Of Tyres" },
  ];

  const data = [
    {
      store: "Morrisons",
      driverName: "John",
      wtnId: "WTN-1234",
      date: "28-8-2025",
      numberOfTyres: "90",
    },
    {
      store: "Waitrose",
      driverName: "Rose",
      wtnId: "WTN-1235",
      date: "28-8-2025",
      numberOfTyres: "190",
    },
    {
      store: "Sainsbury's",
      driverName: "Levl",
      wtnId: "WTN-1236",
      date: "28-8-2025",
      numberOfTyres: "140",
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => {
        setSelectedRow(row); // store the clicked row
        setViewMode(true);
        setOpen(true);
      },
    },
    {
      icon: downloadIcon,
      label: "Download",
      onClick: (row) => {
        console.log("file downloaded");
      },
    },
  ];

  return (
    <>
      <div className="flex gap-6">
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
          {selectedRow ? "WTNs" : ""}
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedRow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Store</p>
                <h6 className="text-lg font-semibold">{selectedRow.store}</h6>
              </div>
              <div>
                <p className="text-sm text-gray-600">Driver</p>
                <h6 className="text-lg font-semibold">
                  {selectedRow.driverName}
                </h6>
              </div>
              <div>
                <p className="text-sm text-gray-600">WTN ID</p>
                <h6 className="text-lg font-semibold">{selectedRow.wtnId}</h6>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <h6 className="text-lg font-semibold">{selectedRow.date}</h6>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number Of Tyres</p>
                <h6 className="text-lg font-semibold">
                  {selectedRow.numberOfTyres}
                </h6>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Wtns;
