import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import { fetchInvoices } from "../../redux/invoiceSlice";

const Invoices = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const storeId = location.state?.storeId; // Optional, passed from ManageStore
  const storeName = location.state?.storeName;

  const { invoices, loading, error } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices({ page: 1, pageSize: 100, storeId })); // fetch filtered by storeId if present
  }, [dispatch, storeId]);

  const columns = [
    { key: "invoiceNumber", label: "Invoice Number" },
    { key: "storeName", label: "Store" },
    { key: "date", label: "Date" },
    {
      key: "fileUrl",
      label: "Invoice",
      render: (row) =>
        row.fileUrl ? (
          <a
            href={row.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
          <span className="text-gray-400">No Invoice</span>
        ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {storeName ? `Invoices for ${storeName}` : "All Invoices"}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : invoices.length > 0 ? (
        <TableDataComp columns={columns} data={invoices} />
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
};

export default Invoices;
