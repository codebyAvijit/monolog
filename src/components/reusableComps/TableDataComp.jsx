import React, { useState } from "react";
import { TablePagination } from "@mui/material";

const TableDataComp = ({ columns = [], data = [], actions = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key ?? idx}
                className={`px-4 text-[16px] font-[400] py-3 text-left ${
                  idx === 0 ? "border-r border-gray-300" : ""
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-3 text-[16px] font-[400] text-center">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={row.driverId ?? row.requestId ?? rowIndex}
              className="border-b"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key ?? colIndex}
                  className={`px-4 text-[16px] font-[400] py-3 ${
                    colIndex === 0 ? "border-r border-gray-300" : ""
                  }`}
                >
                  {typeof col.render === "function"
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}

              {actions.length > 0 && (
                <td className="px-4 py-3 flex justify-center gap-5">
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
                        }`}
                        onClick={() => action.onClick?.(row)}
                      >
                        {action.icon ? (
                          <img
                            src={action.icon}
                            alt={action.label || "action"}
                          />
                        ) : (
                          action.label
                        )}
                      </button>
                    );
                  })}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex p-2 justify-end overflow-hidden">
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Items per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </div>
    </div>
  );
};

export default TableDataComp;
