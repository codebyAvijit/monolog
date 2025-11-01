import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import downloadIcon from "../../assets/icons/download.svg";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import { fetchWtns } from "../../redux/wtnsSlice";

const Wtns = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // StoreId and storeName are optional — only passed when viewing from a store
  const storeId = location.state?.storeId || null;
  const storeName = location.state?.storeName || null;

  const { wtns, loading, error } = useSelector((state) => state.wtns);

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWtns({ page: 1, pageSize: 100, storeId }));
  }, [dispatch, storeId]);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  const columns = [
    { key: "storeName", label: "Store" },
    { key: "driverId", label: "Driver ID" },
    { key: "wtnId", label: "WTN ID" },
    { key: "date", label: "Date" },
    { key: "numberOfTyres", label: "Number Of Tyres" },
    {
      key: "wtnFileUrl",
      label: "WTN File",
      render: (row) =>
        row.wtnFileUrl ? (
          <a
            href={row.wtnFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">No File</span>
        ),
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => handleOpen(row),
    },
    {
      icon: downloadIcon,
      label: "Download",
      onClick: (row) => {
        if (row.wtnFileUrl) window.open(row.wtnFileUrl, "_blank");
      },
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {storeName ? `WTNs for ${storeName}` : "All WTNs"}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : wtns.length > 0 ? (
        <TableDataComp columns={columns} data={wtns} actions={actions} />
      ) : (
        <p>No WTNs found.</p>
      )}

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
          className="flex justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]"
          sx={{ fontWeight: "600", fontSize: "20px", color: "#012622" }}
        >
          WTN Details
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedRow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Store</p>
                <h6 className="text-lg font-semibold">
                  {selectedRow.storeName}
                </h6>
              </div>
              <div>
                <p className="text-sm text-gray-600">Driver ID</p>
                <h6 className="text-lg font-semibold">
                  {selectedRow.driverId}
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
              <div>
                <p className="text-sm text-gray-600">E-Signed</p>
                <h6 className="text-lg font-semibold">{selectedRow.eSigned}</h6>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wtns;
