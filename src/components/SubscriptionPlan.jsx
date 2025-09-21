import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchBarComp from "./reusableComps/SearchBarComp";
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit.svg";
import eyeOpen from "../assets/icons/eyeOpen.svg";
import ButtonComp from "./reusableComps/ButtonComp";
import SelectMenuComp from "./reusableComps/SelectMenuComp";
import TableDataComp from "./reusableComps/TableDataComp";
import FormFieldComp from "./reusableComps/FormFieldComp";
import dayjs from "dayjs";
import DatePickerComp from "./reusableComps/DatePickerComp";

const validateAllFields = (values, expressEnabled = false) => {
  const regexNum = /^\d+$/; // digits only
  let errors = {};

  // Plan Name
  if (!values.planName?.trim()) {
    errors.planName = "Plan Name is required";
  }

  // Plan Type
  if (!values.planType?.trim()) {
    errors.planType = "Plan Type is required";
  }

  // Amount
  if (!values.amount) {
    errors.amount = "Amount is required";
  } else if (!regexNum.test(values.amount)) {
    errors.amount = "Amount should be a valid number";
  }

  // Status
  if (!values.planStatus?.trim()) {
    errors.planStatus = "Status is required";
  }

  // Standard Pickups
  if (!values.standardPickups) {
    errors.standardPickups = "Standard Pickups are required";
  } else if (!regexNum.test(values.standardPickups)) {
    errors.standardPickups = "Standard Pickups should be a valid number";
  }

  // Per Tyre Amount
  if (!values.perTyreAmount) {
    errors.perTyreAmount = "Per Tyre Amount is required";
  } else if (!regexNum.test(values.perTyreAmount)) {
    errors.perTyreAmount = "Per Tyre Amount should be a valid number";
  }

  // Activation Date
  if (!values.planActivationDate) {
    errors.planActivationDate = "Activation Date is required";
  }

  // Express Pickups (only if express toggle is ON)
  if (expressEnabled) {
    if (!values.expressPickups) {
      errors.expressPickups = "Express Pickups are required";
    } else if (!regexNum.test(values.expressPickups)) {
      errors.expressPickups = "Express Pickups should be a valid number";
    }

    if (!values.expressTyreAmount) {
      errors.expressTyreAmount = "Express Per Tyre Amount is required";
    } else if (!regexNum.test(values.expressTyreAmount)) {
      errors.expressTyreAmount =
        "Express Per Tyre Amount should be a valid number";
    }
  }

  return errors;
};

const SubscriptionPlan = () => {
  // const errors = validateAllFields(form, express);

  const [mainSubPlanArray, setMainSubPlanArray] = useState(() => {
    //lazy initializer
    const alreadyStoredPlan = localStorage.getItem("mainSubPlanArray");
    return alreadyStoredPlan ? JSON.parse(alreadyStoredPlan) : [];
  });

  const [open, setOpen] = useState(false);
  const [express, setExpress] = useState(false);
  const [planTypeFilter, setPlanTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [errors, setErrors] = useState({});

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

  const [editingId, setEditingId] = useState("");
  const [editSubPlan, setEditSubPlan] = useState({
    planName: "",
    planType: "",
    planStatus: "",
    amount: "",
    standardPickups: "",
    perTyreAmount: "",
    expressPickups: "",
    expressTyreAmount: "",
  });

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
  };

  //changes cleared as soon as user starts typing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on input
  };

  const handleSave = (e) => {
    e.preventDefault();

    // validate form
    const validationErrors = validateAllFields(form, express);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("Saving Data:", form);

    const newSubscriptionPlanToAdd = {
      id: crypto.randomUUID(),
      planName: form.planName,
      planType: form.planType,
      amount: form.amount,
      pickups: `${form.standardPickups || 0} Standard, ${
        form.expressPickups || 0
      } Express`,
      extraCharges: `£${form.perTyreAmount || 0} per tyre`,
      status: form.planStatus,
      createdOn: dayjs().format("DD-MM-YYYY"),
    };

    setMainSubPlanArray((prev) => {
      const updatedPlans = [...prev, newSubscriptionPlanToAdd];
      localStorage.setItem("mainSubPlanArray", JSON.stringify(updatedPlans));
      return updatedPlans;
    });

    handleClose();
  };

  //delete item

  const deleteItem = (id) => {
    const updated = mainSubPlanArray.filter((item) => item.id !== id);
    setMainSubPlanArray(updated);
    localStorage.setItem("mainSubPlanArray", JSON.stringify(updated));
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
  ];

  const data = [
    {
      planName: "Gold",
      planType: "Yearly",
      amount: "£999",
      pickups: "30 Standard , 20 Express",
      extraCharges: "£2.50 per tyre",
      status: "Active",
      createdOn: "28-8-2025",
    },
    {
      planName: "Sliver",
      planType: "Half-Yearly",
      amount: "£199",
      pickups: "10 Standard , 5 Express",
      extraCharges: "£2.50 per tyre",
      status: "Inactive",
      createdOn: "10-8-2025",
    },
    {
      planName: "Platinum",
      planType: "Monthly",
      amount: "£199",
      pickups: "10 Standard , 5 Express",
      extraCharges: "£2.50 per tyre",
      status: "Inactive",
      createdOn: "10-8-2025",
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => console.log("View", row),
    },
    {
      icon: editIcon,
      label: "Edit",
      onClick: (row) => console.log("Edit", row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      // onClick: (row) => console.log("Delete", row),
      onClick: (row) => deleteItem(row.id),
    },
  ];

  const inputBoxSX = {
    width: "334px", // default width as in Figma
    maxWidth: "100%", // allow shrinking on smaller screens
    "& .MuiOutlinedInput-root": {
      height: "60px",
      "& .MuiOutlinedInput-input": {
        textAlign: "left",
        padding: 0,
      },
    },
  };

  return (
    <div className="h-full">
      {/* Matching User component layout pattern */}
      <div className="flex flex-row flex-wrap justify-between mb-4">
        <div className="flex gap-4  min-w-[250px]">
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
          />
          <SearchBarComp />
          <ButtonComp
            variant="contained"
            sx={{
              maxWidth: "235px",
              height: "60px",
              fontSize: "16px",
            }}
            onClick={handleOpen}
            className="w-full sm:w-auto"
          >
            Add New Subscription Plan
          </ButtonComp>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
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
        fullWidth
        disableAutoFocus={false}
        disableEnforceFocus={false}
        slotProps={{
          paper: {
            sx: {
              maxWidth: "1280px",
              borderRadius: "12px",
              p: 3,
              maxHeight: "598px",
              margin: "20px",
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

        <DialogContent>
          {/* Grid layout matching User component pattern */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <FormFieldComp
              label="Plan Name"
              name="planName"
              // fullWidth
              value={form.planName}
              onChange={handleChange}
              error={!!errors.planName}
              helperText={errors.planName || ""}
            />

            <FormFieldComp
              label="Plan Type"
              name="planType"
              // fullWidth
              value={form.planType}
              onChange={handleChange}
              error={!!errors.planType}
              helperText={errors.planType || ""}
            />

            <FormFieldComp
              label="Amount"
              name="amount"
              // fullWidth
              value={form.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount || ""}
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
            />

            <FormFieldComp
              label="Maximum Standard Pick-ups"
              name="standardPickups"
              // fullWidth
              value={form.standardPickups}
              onChange={handleChange}
              error={!!errors.standardPickups}
              helperText={errors.standardPickups || ""}
            />

            <FormFieldComp
              label="Per Tyre Amount"
              name="perTyreAmount"
              // fullWidth
              value={form.perTyreAmount}
              onChange={handleChange}
              error={!!errors.perTyreAmount}
              helperText={errors.perTyreAmount || ""}
            />

            <DatePickerComp
              label="Plan Activation Date"
              value={
                form.planActivationDate ? dayjs(form.planActivationDate) : null
              }
              onChange={(newValue) =>
                setForm((prev) => ({ ...prev, planActivationDate: newValue }))
              }
              placeholder="Select Activation Date"
              error={!!errors.planActivationDate}
              helperText={errors.planActivationDate || ""}
            />
          </div>
          {/* Toggle - matching User component spacing */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Express Pickups</span>
            <Switch
              checked={express}
              onChange={() => setExpress((s) => !s)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#003B36" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#003B36",
                },
              }}
            />
          </div>

          {/* Express fields - conditional with proper spacing */}
          {express && (
            <div className="flex gap-12 mt-5">
              <FormFieldComp
                label="Maximum Number of Express Pickups"
                name="expressPickups"
                // fullWidth
                value={form.expressPickups}
                onChange={handleChange}
                error={!!errors.expressPickups}
                helperText={errors.expressPickups || ""}
              />

              <FormFieldComp
                label="Per Tyre Amount of Express Pickups"
                name="expressTyreAmount"
                // fullWidth
                value={form.expressTyreAmount}
                onChange={handleChange}
                error={!!errors.expressTyreAmount}
                helperText={errors.expressTyreAmount || ""}
              />
            </div>
          )}
        </DialogContent>

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
      </Dialog>
    </div>
  );
};

export default SubscriptionPlan;
