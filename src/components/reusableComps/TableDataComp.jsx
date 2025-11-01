import React, { useState, useEffect } from "react";
import { TablePagination } from "@mui/material";

const TableDataComp = ({
  columns = [],
  data = [],
  actions = [],
  showRightBorder = false,
  bottomBorderColor = "border-gray-200",
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Normalize data for table
  const tableData = Array.isArray(data)
    ? data
    : data?.results && Array.isArray(data.results)
    ? data.results
    : [];

  const totalCount = Array.isArray(data)
    ? data.length
    : data?.count ?? tableData.length;

  // Pagination
  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Reset page if data changes
  useEffect(() => {
    if (page * rowsPerPage >= tableData.length) setPage(0);
  }, [tableData, page, rowsPerPage]);

  // Safe renderer to avoid object rendering crash
  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      try {
        return Array.isArray(value) ? value.join(", ") : JSON.stringify(value);
      } catch {
        return "Invalid data";
      }
    }
    return value.toString();
  };

  return (
    <div className="w-full">
      {/* Responsive wrapper with horizontal scroll on mobile */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key ?? idx}
                  className={`px-3 md:px-4 text-sm md:text-[16px] font-[400] py-2 md:py-3 text-left border-b ${bottomBorderColor} whitespace-nowrap ${
                    showRightBorder && idx === 0
                      ? "border-r border-gray-300"
                      : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th
                  className={`px-3 md:px-4 py-2 md:py-3 text-sm md:text-[16px] font-[400] text-center border-b ${bottomBorderColor} whitespace-nowrap`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id ?? row.driverId ?? row.requestId ?? rowIndex}
                  className={`border-b ${bottomBorderColor} hover:bg-gray-50 transition-colors`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key ?? colIndex}
                      className={`px-3 md:px-4 text-sm md:text-[16px] font-[400] py-2 md:py-3 border-b ${bottomBorderColor} ${
                        showRightBorder && colIndex === 0
                          ? "border-r border-gray-300"
                          : ""
                      } break-words max-w-xs`}
                    >
                      {typeof col.render === "function"
                        ? col.render(row[col.key], row)
                        : formatValue(row[col.key])}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td
                      className={`px-3 md:px-4 py-2 md:py-3 border-b ${bottomBorderColor}`}
                    >
                      <div className="flex justify-center gap-3 md:gap-5 flex-wrap">
                        {actions.map((action, i) => {
                          if (action.render) {
                            return <span key={i}>{action.render(row)}</span>;
                          }

                          return (
                            <button
                              key={action.label ?? i}
                              className={`${
                                action.color
                                  ? action.color
                                  : "text-[rgba(233,138,21,1)] hover:text-black"
                              } transition-colors`}
                              onClick={() => action.onClick?.(row)}
                              title={action.label}
                            >
                              {action.icon ? (
                                <img
                                  src={action.icon}
                                  alt={action.label || "action"}
                                  className="w-4 h-4 md:w-5 md:h-5 object-contain"
                                />
                              ) : (
                                <span className="text-xs md:text-sm">
                                  {action.label}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Pagination */}
      <div className="flex justify-center md:justify-end p-2 bg-white rounded-b-lg overflow-x-auto">
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Items:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
          sx={{
            // Make pagination more compact on mobile
            "& .MuiTablePagination-toolbar": {
              minHeight: { xs: "48px", md: "52px" },
              paddingLeft: { xs: "8px", md: "16px" },
              paddingRight: { xs: "8px", md: "16px" },
            },
            "& .MuiTablePagination-selectLabel": {
              fontSize: { xs: "12px", md: "14px" },
              marginBottom: 0,
            },
            "& .MuiTablePagination-displayedRows": {
              fontSize: { xs: "12px", md: "14px" },
              marginBottom: 0,
            },
            "& .MuiTablePagination-select": {
              fontSize: { xs: "12px", md: "14px" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TableDataComp;
