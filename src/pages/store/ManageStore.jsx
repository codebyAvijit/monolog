import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import downloadIcon from "../../assets/icons/download.svg";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import { fetchStores } from "../../redux/storeSlice";
import { fetchInvoices } from "../../redux/invoiceSlice";

const ManageStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { stores, loading, error } = useSelector((state) => state.stores);

  // Local state
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [filterBuisnessType, setFilterBuisnessType] = useState("");

  //view mode data useState
  const [selectedStore, setSelectedStore] = useState(null);

  //invoices data from redux
  const { invoices } = useSelector((state) => state.invoices);

  // Fetch stores on component mount
  useEffect(() => {
    dispatch(fetchStores({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  //fetch invoices data on component mount
  // useEffect(() => {
  //   dispatch(fetchInvoices({ page: 1, pageSize: 10 }));
  // }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
    setSelectedStore(null);
  };

  const handleInvoice = () => {
    console.log("handle Invoice");
  };

  const handleWtns = () => {
    console.log("WTNS");
  };

  const handlePickup = () => {
    console.log("pick ups");
  };

  const coloumns = [
    { key: "store", label: "Store" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "buisnessType", label: "Buisness Type" },
    { key: "address", label: "Address" },
  ];

  const actions = [
    {
      label: "View Invoice",
      render: (row) => (
        <NavLink
          to="/store/invoices"
          state={{ storeId: row.id, storeName: row.store }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          View Invoice
        </NavLink>
      ),
    },

    {
      label: "View WTN",
      render: (row) => (
        <NavLink
          to="/store/wtns"
          state={{ storeId: row.id, storeName: row.store }}
          className="text-[rgba(233,138,21,1)] hover:text-black underline"
        >
          View WTN
        </NavLink>
      ),
    },
    {
      icon: eyeOpen,
      label: "View",
      // onClick: (row) => console.log("View", row),
      onClick: (row) => {
        setSelectedStore(row);
        setViewMode(true); // enable view mode
        setOpen(true); // open modal
      },
    },
  ];

  const columnForModalTransactionDetail = [
    {
      key: "transaction",
      label: "Transaction",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "tyres",
      label: "Tyres",
    },
    {
      key: "amountRecieve",
      label: "Amount Recieve",
    },
  ];
  const dataForModalTransactionDetail = [
    {
      transaction: "TXN-UK1001",
      date: "01/09/2025",
      tyres: "80",
      amountRecieve: "£250.00",
    },
    {
      transaction: "TXN-UK1002",
      date: "01/09/2025",
      tyres: "180",
      amountRecieve: "£120.00",
    },
    {
      transaction: "TXN-UK1003",
      date: "01/09/2025",
      tyres: "160",
      amountRecieve: "£49.00",
    },
  ];
  const actionForModalTransactionDetail = [
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

  const columnForModalSubPlansDetail = [
    { key: "planName", label: "Plan Name" },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "validity",
      label: "Validity",
    },
    {
      key: "amount",
      label: "Amount",
    },
    {
      key: "type",
      label: "Type",
    },
  ];

  const dataForModalSubPlansDetail = [
    {
      planName: "Yearly",
      date: "01/09/2025 - 31/08/2026",
      validity: "12 Months",
      amount: "£29.99",
      type: "Express",
    },
    {
      planName: "Half Yearly",
      date: "01/09/2025 - 28/02/2026",
      validity: "6 Months",
      amount: "£149.99",
      type: "Standard",
    },
    {
      planName: "Quarterly",
      date: "01/09/2025 - 30/11/2025",
      validity: "3 Months",
      amount: "£9.99",
      type: "Standard",
    },
  ];

  const actionsForModalSubPlansDetail = [
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
      <div className="flex flex-wrap gap-4 w-full">
        <div className="w-full sm:w-[334px]">
          <SelectMenuComp
            label="Buisness Type"
            name="filterBuisnessType"
            value={filterBuisnessType}
            onChange={(e) => setFilterBuisnessType(e.target.value)}
            options={[
              { value: "all", label: "All" },
              { value: "soloTrader", label: "Solo Trader" },
              { value: "partnership", label: "Partnership" },
              { value: "limitedCompany", label: "Limited Company" },
            ]}
          />
        </div>
        <div className="w-full sm:w-[334px]">
          <SearchBarComp />
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <div>Loading stores...</div>
        ) : error ? (
          <div>Error loading stores: {error}</div>
        ) : (
          <TableDataComp columns={coloumns} data={stores} actions={actions} />
        )}
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
          Store: {selectedStore?.store || "N/A"}
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

              {selectedStore && (
                <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-6">
                  {[
                    { label: "Store", value: selectedStore.store },
                    { label: "Phone Number", value: selectedStore.phoneNumber },
                    {
                      label: "Business Type",
                      value: selectedStore.buisnessType,
                    },
                    { label: "Vat Number", value: selectedStore.vat_no },
                    { label: "CIN Number", value: selectedStore.cin_no },
                    { label: "Address", value: selectedStore.address },
                    {
                      label: "Hours Of Operations",
                      value:
                        selectedStore.hours_of_operation?.length > 0
                          ? selectedStore.hours_of_operation
                              .map(
                                (op) =>
                                  `${op.days_of_week}: ${op.open_time} - ${op.close_time}`
                              )
                              .join(", ")
                          : "No timing info available",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[14px] font-medium text-gray-600">
                        {item.label}
                      </p>
                      <h6 className="text-[16px] font-semibold text-gray-900">
                        {item.value || "N/A"}
                      </h6>
                    </div>
                  ))}
                </div>
              )}

              {/* Transaction Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  Transaction Details
                </h2>
                <TableDataComp
                  columns={columnForModalTransactionDetail}
                  data={dataForModalTransactionDetail}
                  actions={actionForModalTransactionDetail}
                />
              </div>

              {/* Subscription Plan */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Subscription Plan
                </h2>
                <TableDataComp
                  columns={columnForModalSubPlansDetail}
                  data={dataForModalSubPlansDetail}
                  actions={actionsForModalSubPlansDetail}
                />
              </div>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 2 }}>
          <ButtonComp
            variant="contained"
            sx={{
              width: "120px",
              height: "50px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
            onClick={handleInvoice}
          >
            Invoice
          </ButtonComp>
          <ButtonComp
            variant="contained"
            sx={{
              width: "120px",
              height: "50px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
            onClick={handleWtns}
          >
            WTNS
          </ButtonComp>
          <ButtonComp
            variant="contained"
            sx={{
              width: "120px",
              height: "50px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
            onClick={handlePickup}
          >
            PICK-UP
          </ButtonComp>
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

export default ManageStore;
