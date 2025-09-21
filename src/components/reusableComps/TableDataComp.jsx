import React, { useState } from "react";
import { TablePagination } from "@mui/material";

const TableDataComp = ({
  columns = [], // [{ key: "plan", label: "Plan Name" }, ...]
  data = [], // [{ plan: "Yearly", amount: "£999" }, ...]
  actions = [], // [{ icon: editIcon, onClick: (row) => {}, color: "text-gray-600" }]
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // slice the data based on pagination
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 text-[16px] font-[400] py-3 text-left"
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-3 text-[16px] font-[400] text-left">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr key={idx} className="border-b">
              {columns.map((col) => (
                <td key={col.key} className="px-4 text-[16px] font-[400] py-3">
                  {typeof col.render === "function"
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-4 py-3 flex gap-5">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      className={`${
                        action.color || "text-gray-600 hover:text-black"
                      }`}
                      onClick={() => action.onClick(row)}
                    >
                      <img src={action.icon} alt={action.label || "action"} />
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination at bottom right */}
      <div className="flex p-2 justify-end overflow-hidden">
        <TablePagination
          // sx={{
          //   width: "286px",
          //   height: "31px",
          //   "& .MuiTablePagination-toolbar": {
          //     minHeight: "31px",
          //     height: "31px",
          //     padding: 0,
          //   },
          // }}
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
            `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </div>
    </div>
  );
};

export default TableDataComp;

// Previous hardcoded version

// import React from "react";
// import deleteIcon from "../../assets/icons/delete.svg";
// import editIcon from "../../assets/icons/edit.svg";
// import eyeOpen from "../../assets/icons/eyeOpen.svg";
// const TableDataComp = () => {
//   return (
//     <>
//       <div className="overflow-x-auto shadow rounded-lg">
//         <table className="min-w-full text-sm border-collapse">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-4 py-3 text-left">Plan Name</th>
//               <th className="px-4 py-3 text-left">Amount</th>
//               <th className="px-4 py-3 text-left">Pickups Included</th>
//               <th className="px-4 py-3 text-left">Extra Charges</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Created On</th>
//               <th className="px-4 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[
//               {
//                 plan: "Yearly",
//                 amount: "£999",
//                 pickups: "30 Standard , 20 Express",
//               },
//               {
//                 plan: "Half yearly",
//                 amount: "£999",
//                 pickups: "20 Standard , 10 Express",
//               },
//               {
//                 plan: "Monthly",
//                 amount: "£999",
//                 pickups: "10 Standard , 5 Express",
//               },
//             ].map((row, idx) => (
//               <tr key={idx} className="border-b">
//                 <td className="px-4 py-3">{row.plan}</td>
//                 <td className="px-4 py-3">{row.amount}</td>
//                 <td className="px-4 py-3">{row.pickups}</td>
//                 <td className="px-4 py-3">£2.50 per tyre</td>
//                 <td className="px-4 py-3">
//                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
//                     Active
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">28-8-2025</td>
//                 <td className="px-4 py-3 flex gap-5">
//                   <button className="text-gray-600 hover:text-black">
//                     <img src={eyeOpen} />
//                   </button>
//                   <button className="text-gray-600 hover:text-black">
//                     <img src={editIcon} />
//                   </button>
//                   <button className="text-red-600 hover:text-red-800">
//                     <img src={deleteIcon} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default TableDataComp;
