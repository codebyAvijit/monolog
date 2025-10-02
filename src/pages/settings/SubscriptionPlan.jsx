// Import necessary libraries and components
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addPlan,
  deletePlan,
  setPlans,
  updatePlan,
} from "../../redux/subscriptionPlanSlice";

import { subPlanValidationConfig } from "../../utils/subPlanValidationConfig";
import { validateFields } from "../../utils/validation";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
} from "@mui/material";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";

// const validateAllFields = (values, expressEnabled = false) => {
//   const regexNum = /^\d+$/; // digits only
//   let errors = {};

//   // Plan Name
//   if (!values.planName?.trim()) {
//     errors.planName = "Plan Name is required";
//   }

//   // Plan Type
//   if (!values.planType?.trim()) {
//     errors.planType = "Plan Type is required";
//   }

//   // Amount
//   if (!values.amount) {
//     errors.amount = "Amount is required";
//   } else if (!regexNum.test(values.amount)) {
//     errors.amount = "Amount should be a valid number";
//   }

//   // Status
//   if (!values.planStatus?.trim()) {
//     errors.planStatus = "Status is required";
//   }

//   // Standard Pickups
//   if (!values.standardPickups) {
//     errors.standardPickups = "Standard Pickups are required";
//   } else if (!regexNum.test(values.standardPickups)) {
//     errors.standardPickups = "Standard Pickups should be a valid number";
//   }

//   // Per Tyre Amount
//   if (!values.perTyreAmount) {
//     errors.perTyreAmount = "Per Tyre Amount is required";
//   } else if (!regexNum.test(values.perTyreAmount)) {
//     errors.perTyreAmount = "Per Tyre Amount should be a valid number";
//   }

//   // Activation Date
//   if (!values.planActivationDate) {
//     errors.planActivationDate = "Activation Date is required";
//   }

//   // Express Pickups (only if express toggle is ON)
//   if (expressEnabled) {
//     if (!values.expressPickups) {
//       errors.expressPickups = "Express Pickups are required";
//     } else if (!regexNum.test(values.expressPickups)) {
//       errors.expressPickups = "Express Pickups should be a valid number";
//     }

//     if (!values.expressTyreAmount) {
//       errors.expressTyreAmount = "Express Per Tyre Amount is required";
//     } else if (!regexNum.test(values.expressTyreAmount)) {
//       errors.expressTyreAmount =
//         "Express Per Tyre Amount should be a valid number";
//     }
//   }

//   return errors;
// };

const validateAllFields = (values) => {
  return validateFields(values, subPlanValidationConfig);
};

const SubscriptionPlan = () => {
  // const errors = validateAllFields(form, express);

  // const [mainSubPlanArray, setMainSubPlanArray] = useState(() => {
  //   //lazy initializer
  //   const alreadyStoredPlan = localStorage.getItem("mainSubPlanArray");
  //   return alreadyStoredPlan ? JSON.parse(alreadyStoredPlan) : [];
  // });

  //REPLACING MAIN PLAN ARRAY WITH REDUX INSTEAD OF LOCAL USESTATE

  const dispatch = useDispatch();
  const mainSubPlanArray = useSelector((state) => state.subscriptionPlan.plans);

  const [open, setOpen] = useState(false);
  const [express, setExpress] = useState(false);
  const [planTypeFilter, setPlanTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [errors, setErrors] = useState({});

  //useState to view a particular selected row

  // const [selectedRow, setSelectedRow] = useState(null);

  //use state for view mode

  const [viewMode, setViewMode] = useState(false);

  //setting up form
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    planName: "",
    planType: "",
    planStatus: "",
    amount: "",
    standardPickups: "",
    perTyreAmount: "",
    expressPickups: "",
    expressTyreAmount: "",
  });

  //SETING UP STATE FOR IMPLEMENTING EDITING FUNCTIONALITY USING REDUX

  const [editingId, setEditingId] = useState("");

  // const [editSubPlan, setEditSubPlan] = useState({
  //   planName: "",
  //   planType: "",
  //   planStatus: "",
  //   amount: "",
  //   standardPickups: "",
  //   perTyreAmount: "",
  //   expressPickups: "",
  //   expressTyreAmount: "",
  // });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setForm({
      id: crypto.randomUUID(),
      planName: "",
      planType: "",
      planStatus: "",
      amount: "",
      standardPickups: "",
      perTyreAmount: "",
      expressPickups: "",
      expressTyreAmount: "",
    });
    setExpress(false); // reset toggle if needed
    setEditingId("");
    setViewMode(false); // reset back
  };

  //changes cleared as soon as user starts typing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on input

    // Run validation for this field only
    const fieldError =
      validateAllFields({ ...form, [name]: value })[name] || "";
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  //EDITING LOGIC IMPLEMENTED USING REDUX

  // ---------- EDIT handler ----------

  const handleEdit = (row) => {
    // parsing pickups like "30 Standard , 20 Express"
    let std = "";
    let exp = "";
    if (row.pickups) {
      const pickupsRegex = /(\d+)\s*Standard\s*,\s*(\d+)\s*Express/i;
      const m = row.pickups.match(pickupsRegex);
      if (m) {
        std = m[1] || "";
        exp = m[2] || "";
      }
    }

    // parse per-tyre amount like "£2.50 per tyre"
    let perTyre = "";
    if (row.extraCharges) {
      const perRegex = /£?([\d.]+)/;
      const pm = row.extraCharges.match(perRegex);
      perTyre = pm ? pm[1] : "";
    }

    // parse amount: strip leading £ if present
    const amountValue =
      row.amount && typeof row.amount === "string"
        ? row.amount.replace(/£/g, "").trim()
        : row.amount || "";

    //express per tyre amount

    let expressPerTyre = "";
    if (row.expressExtraCharges) {
      const pmExp = row.expressExtraCharges.match(/£?([\d.]+)/);
      expressPerTyre = pmExp ? pmExp[1] : "";
    }

    // set form fields
    setForm({
      id: row.id || "",
      planName: row.planName || "",
      planType: row.planType || "",
      planStatus: row.status || "",
      amount: amountValue,
      standardPickups: std,
      perTyreAmount: perTyre,
      expressPickups: exp,
      expressTyreAmount: expressPerTyre,
      planActivationDate: row.planActivationDate
        ? dayjs(row.planActivationDate, "DD-MM-YYYY")
        : null,
    });

    setExpress(Boolean(exp && Number(exp) > 0));
    setEditingId(row.id || "");
    setOpen(true);
  };

  // const handleSave = (e) => {
  //   e.preventDefault();

  //   // validate form
  //   const validationErrors = validateAllFields(form, express);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   setErrors({});
  //   console.log("Saving Data:", form);

  //   const newSubscriptionPlanToAdd = {
  //     id: crypto.randomUUID(),
  //     planName: form.planName,
  //     planType: form.planType,
  //     amount: form.amount,
  //     pickups: `${form.standardPickups || 0} Standard, ${
  //       form.expressPickups || 0
  //     } Express`,
  //     extraCharges: `£${form.perTyreAmount || 0} per tyre`,
  //     status: form.planStatus,
  //     createdOn: dayjs().format("DD-MM-YYYY"),
  //   };

  //   setMainSubPlanArray((prev) => {
  //     const updatedPlans = [...prev, newSubscriptionPlanToAdd];
  //     localStorage.setItem("mainSubPlanArray", JSON.stringify(updatedPlans));
  //     return updatedPlans;
  //   });

  //   handleClose();
  // };

  //REPLACING HANDLE SAVE LOGIC WITH REDUX

  const handleSave = (e) => {
    e.preventDefault();
    // const validationErrors = validateAllFields(form, express);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    const validationErrors = validateFields(form, subPlanValidationConfig, {
      expressEnabled: express,
      expressPickupsRequired: true,
      expressAmountRequired: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    //if clicked on edit button

    // build display fields stored in the list
    const pickupsDisplay = `${form.standardPickups || 0} Standard , ${
      form.expressPickups || 0
    } Express`;
    const extraChargesDisplay = `£${form.perTyreAmount || 0} per tyre`;
    const expressChargesDisplay = `£${form.expressTyreAmount || 0} per tyre`;

    // ensure amount has £ prefix for display
    const amountDisplay = String(form.amount).trim().startsWith("£")
      ? String(form.amount).trim()
      : `£${String(form.amount).trim()}`;

    if (editingId) {
      // update existing plan
      const updatedPayload = {
        id: editingId,
        planName: form.planName,
        planType: form.planType,
        amount: amountDisplay,
        pickups: pickupsDisplay,
        extraCharges: extraChargesDisplay,
        expressExtraCharges: expressChargesDisplay,
        status: form.planStatus,
        planActivationDate: form.planActivationDate
          ? dayjs(form.planActivationDate).format("DD-MM-YYYY")
          : null,
      };

      dispatch(updatePlan(updatedPayload));
    } else {
      // add new plan (slice will create id & createdOn)
      const newPlanPayload = {
        planName: form.planName,
        planType: form.planType,
        amount: amountDisplay,
        pickups: pickupsDisplay,
        extraCharges: extraChargesDisplay,
        status: form.planStatus,
        planActivationDate: form.planActivationDate
          ? dayjs(form.planActivationDate).format("DD-MM-YYYY")
          : null,
      };

      dispatch(addPlan(newPlanPayload));
    }

    handleClose();
  };

  //delete item

  // const deleteItem = (id) => {
  //   const updated = mainSubPlanArray.filter((item) => item.id !== id);
  //   setMainSubPlanArray(updated);
  //   localStorage.setItem("mainSubPlanArray", JSON.stringify(updated));
  // };

  //REPLACINF DELETE LOGIC WITH REDUX

  const deleteItem = (id) => {
    dispatch(deletePlan(id));
  };

  const columns = [
    { key: "planName", label: "Plan Name" },
    { key: "planType", label: "Plan Type" },
    { key: "amount", label: "Amount" },
    { key: "pickups", label: "Pickups Included" },
    { key: "extraCharges", label: "Extra Charges" },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span
          className={`inline-block px-2 py-1 text-center text-[16px] font-[700] text-xs w-[70px] h-[30px] rounded-[30px] ${
            val === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: "createdOn", label: "Created On" },
    { key: "planActivationDate", label: "Activation Date" },
  ];

  //Dummy Data

  // const data = [
  //   {
  //     planName: "Gold",
  //     planType: "Yearly",
  //     amount: "£999",
  //     pickups: "30 Standard , 20 Express",
  //     extraCharges: "£2.50 per tyre",
  //     status: "Active",
  //     createdOn: "28-8-2025",
  //   },
  //   {
  //     planName: "Sliver",
  //     planType: "Half-Yearly",
  //     amount: "£199",
  //     pickups: "10 Standard , 5 Express",
  //     extraCharges: "£2.50 per tyre",
  //     status: "Inactive",
  //     createdOn: "10-8-2025",
  //   },
  //   {
  //     planName: "Platinum",
  //     planType: "Monthly",
  //     amount: "£199",
  //     pickups: "10 Standard , 5 Express",
  //     extraCharges: "£2.50 per tyre",
  //     status: "Inactive",
  //     createdOn: "10-8-2025",
  //   },
  // ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      // onClick: (row) => console.log("View", row),
      onClick: (row) => {
        // setSelectedRow(row);
        // setForm(row); // fill the form with selected row data
        // setViewMode(true); // enable view mode
        // setOpen(true); // open modal
        // reusing the parsing logic from handleEdit
        handleEdit(row);
        setViewMode(true);
      },
    },
    {
      icon: editIcon,
      label: "Edit",
      // onClick: (row) => console.log("Edit", row),
      onClick: (row) => handleEdit(row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      // onClick: (row) => console.log("Delete", row),
      onClick: (row) => {
        let confirmation = confirm("Are you sure you want to proceed?");
        if (confirmation) {
          alert("You chose to proceed.");
          deleteItem(row.id);
        } else {
          alert("You cancelled the action.");
        }
      },
    },
  ];

  return (
    <>
      <Dialog
        // open={!!selectedRow}
        // onClose={() => setSelectedRow(null)}
        disableRestoreFocus
        onClose={() => handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          {viewMode
            ? "View Subscription"
            : editingId
            ? "Edit Subscription"
            : "Add New Subscription"}
          {/* <IconButton onClick={() => setSelectedRow(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle> */}
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogActions>
          <ButtonComp onClick={() => setSelectedRow(null)}>Close</ButtonComp>
        </DialogActions>
      </Dialog>
      {/* )} */}

      <div className="flex flex-col md:flex-row justify-between gap-5">
        <SelectMenuComp
          label="Plan Type"
          name="planTypeFilter"
          value={planTypeFilter}
          onChange={(e) => {
            setPlanTypeFilter(e.target.value);
          }}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
          sx={{ borderRadius: "10px" }}
        />
        <SelectMenuComp
          label="Status"
          name="statusFilter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
          }}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
          sx={{ borderRadius: "10px" }}
        />
        <SearchBarComp />
        <ButtonComp
          variant="contained"
          sx={{
            width: { xs: "334px" }, // responsive width
            height: "60px",
            fontSize: "16px",
          }}
          onClick={handleOpen}
        >
          Add New Subscription Plan
        </ButtonComp>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-5 shadow rounded-lg">
        <TableDataComp
          columns={columns}
          data={mainSubPlanArray}
          actions={actions}
        />
      </div>

      {/* Modal - Matching User component dialog pattern */}
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        // fullWidth
        padding="1px"
        disableAutoFocus={false}
        disableEnforceFocus={false}
        slotProps={{
          paper: {
            sx: {
              maxWidth: "1280px", // fixed width
              height: "598px", // fixed height (matches Figma)
              borderRadius: "12px",
              p: 0,
              margin: "10px",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle className="flex flex-row justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]">
          Add New Subscription Plan
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, overflow: "auto" }}>
          {/* Grid layout matching User component pattern */}
          <div className="grid grid-cols-1 pt-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <FormFieldComp
              label="Plan Name"
              name="planName"
              // fullWidth
              value={form.planName}
              onChange={handleChange}
              error={!!errors.planName}
              helperText={errors.planName || ""}
              disabled={viewMode}
            />

            <FormFieldComp
              label="Plan Type"
              name="planType"
              // fullWidth
              value={form.planType}
              onChange={handleChange}
              error={!!errors.planType}
              helperText={errors.planType || ""}
              disabled={viewMode}
            />

            <FormFieldComp
              label="Amount"
              name="amount"
              // fullWidth
              value={form.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount || ""}
              disabled={viewMode}
            />

            <SelectMenuComp
              label="Status"
              name="planStatus"
              value={form.planStatus}
              onChange={handleChange}
              error={!!errors.planStatus}
              helperText={errors.planStatus || " "}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              disabled={viewMode}
            />

            <FormFieldComp
              label="Maximum Standard Pick-ups"
              name="standardPickups"
              // fullWidth
              value={form.standardPickups}
              onChange={handleChange}
              error={!!errors.standardPickups}
              helperText={errors.standardPickups || ""}
              disabled={viewMode}
            />

            <FormFieldComp
              label="Per Tyre Amount"
              name="perTyreAmount"
              // fullWidth
              value={form.perTyreAmount}
              onChange={handleChange}
              error={!!errors.perTyreAmount}
              helperText={errors.perTyreAmount || ""}
              disabled={viewMode}
            />

            <DatePickerComp
              label="Plan Activation Date"
              value={
                form.planActivationDate ? dayjs(form.planActivationDate) : null
              }
              onChange={(newValue) =>
                setForm((prev) => ({
                  ...prev,
                  planActivationDate: dayjs(newValue),
                }))
              }
              placeholder="Select Activation Date"
              error={!!errors.planActivationDate}
              helperText={errors.planActivationDate || ""}
              disabled={viewMode}
            />
          </div>
          {/* Toggle - matching User component spacing */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mt-5">Express Pickups</span>
            <Switch
              checked={express}
              onChange={() => setExpress((s) => !s)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#003B36" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#003B36",
                },
                marginTop: "20px",
              }}
            />
          </div>

          {/* Express fields - conditional with proper spacing */}
          {express && (
            <div className="flex gap-8 mt-5 sm:flex-wrap">
              <FormFieldComp
                label="Maximum Number of Express Pickups"
                name="expressPickups"
                // fullWidth
                value={form.expressPickups}
                onChange={handleChange}
                error={!!errors.expressPickups}
                helperText={errors.expressPickups || ""}
                disabled={viewMode}
              />

              <FormFieldComp
                label="Per Tyre Amount of Express Pickups"
                name="expressTyreAmount"
                // fullWidth
                value={form.expressTyreAmount}
                onChange={handleChange}
                error={!!errors.expressTyreAmount}
                helperText={errors.expressTyreAmount || ""}
                disabled={viewMode}
              />
            </div>
          )}
        </DialogContent>
        {!viewMode && (
          <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 2 }}>
            <ButtonComp
              variant="contained"
              sx={{
                width: "120px",
                height: "60px",
                fontSize: "16px",
                borderRadius: "6px",
              }}
              onClick={handleSave}
            >
              Save
            </ButtonComp>

            <ButtonComp
              variant="outlined"
              sx={{
                width: "120px",
                height: "60px",
                fontSize: "16px",
                borderRadius: "6px",
              }}
              onClick={handleClose}
            >
              Cancel
            </ButtonComp>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default SubscriptionPlan;
