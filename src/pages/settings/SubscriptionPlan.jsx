import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
} from "../../redux/subscriptionPlanSlice";
import { subPlanValidationConfig } from "../../utils/subPlanValidationConfig";
import { validateFields } from "../../utils/validation";
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  Snackbar,
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
import DeleteConfirmationPrompt from "../../components/reusableComps/DeleteConfirmationPrompt";

const validateAllFields = (values, express) => {
  return validateFields(values, subPlanValidationConfig, {
    expressEnabled: express,
    expressPickupsRequired: express,
    expressAmountRequired: express,
  });
};

const SubscriptionPlan = () => {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector(
    (state) => state.subscriptionPlan
  );

  const [open, setOpen] = useState(false);
  const [express, setExpress] = useState(false);
  const [planTypeFilter, setPlanTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});
  const [viewMode, setViewMode] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //  Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    planId: null,
  });

  const [form, setForm] = useState({
    planName: "",
    planType: "",
    planStatus: "",
    amount: "",
    standardPickups: "",
    perTyreAmount: "",
    expressPickups: "",
    expressTyreAmount: "",
    planActivationDate: null,
  });

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setForm({
      planName: "",
      planType: "",
      planStatus: "",
      amount: "",
      standardPickups: "",
      perTyreAmount: "",
      expressPickups: "",
      expressTyreAmount: "",
      planActivationDate: null,
    });
    setExpress(false);
    setEditingId("");
    setViewMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "planType" ? value.toLowerCase() : value;

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    const fieldError =
      validateAllFields({ ...form, [name]: formattedValue }, express)[name] ||
      "";

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleEdit = (row) => {
    const [std = "", exp = ""] = row.pickups
      ? row.pickups.split(",").map((s) => s.trim().split(" ")[0])
      : ["", ""];

    const perTyre = row.extraCharges
      ? row.extraCharges.replace(/£| per tyre/g, "").trim()
      : "";
    const expressPerTyre = row.expressExtraCharges
      ? row.expressExtraCharges.replace(/£| per tyre/g, "").trim()
      : "";

    const amountValue = row.amount ? row.amount.replace(/£/g, "").trim() : "";

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

  const handleSave = async (e) => {
    e.preventDefault();

    const validationErrors = validateAllFields(form, express);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const pickupsDisplay = `${form.standardPickups || 0} Standard, ${
      form.expressPickups || 0
    } Express`;
    const extraChargesDisplay = `£${form.perTyreAmount || 0} per tyre`;
    const expressChargesDisplay = `£${form.expressTyreAmount || 0} per tyre`;
    const amountDisplay = String(form.amount).trim().startsWith("£")
      ? String(form.amount).trim()
      : `£${String(form.amount).trim()}`;

    const payload = {
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

    try {
      if (editingId) {
        await dispatch(
          updateSubscriptionPlan({ id: editingId, planData: payload })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Plan updated successfully",
          severity: "success",
        });
      } else {
        await dispatch(createSubscriptionPlan(payload)).unwrap();
        setSnackbar({
          open: true,
          message: "Plan created successfully",
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message || "Operation failed"}`,
        severity: "error",
      });
    }
  };

  //  Open delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, planId: id });
  };

  //  Close delete confirmation dialog
  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, planId: null });
  };

  //  Confirm delete action
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteSubscriptionPlan(deleteDialog.planId)).unwrap();
      setSnackbar({
        open: true,
        message: "Plan deleted successfully",
        severity: "info",
      });
      await dispatch(fetchSubscriptionPlans()).unwrap();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message || "Deletion failed"}`,
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "" });
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
          className={`inline-block px-2 py-1 text-center text-xs md:text-sm font-bold min-w-[70px] h-[28px] md:h-[30px] rounded-[30px] ${
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

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => {
        handleEdit(row);
        setViewMode(true);
      },
    },
    {
      icon: editIcon,
      label: "Edit",
      onClick: (row) => handleEdit(row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      onClick: (row) => handleDeleteClick(row.id), //  Updated to use dialog
    },
  ];

  const filteredPlans = plans.filter((plan) => {
    const matchesPlanType = planTypeFilter
      ? plan.planType === planTypeFilter
      : true;
    const matchesStatus = statusFilter ? plan.status === statusFilter : true;
    const matchesSearch = searchQuery
      ? plan.planName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesPlanType && matchesStatus && matchesSearch;
  });

  return (
    <>
      {loading && (
        <div className="text-center p-4 text-sm md:text-base">Loading...</div>
      )}
      {error && (
        <div className="text-center p-4 text-red-600 text-sm md:text-base">
          Error: {error}
        </div>
      )}
      {!loading && !error && (
        <>
          {/* Filters Section */}
          <div
            className="w-full mx-auto container-3xl"
            style={{ padding: "clamp(16px, 2vw, 25px)" }}
          >
            <div className="flex flex-wrap gap-4 items-end justify-between">
              <div className="w-full sm:w-auto flex flex-wrap gap-4">
                <div className="w-full sm:w-[283px]">
                  <SelectMenuComp
                    label="Plan Type"
                    name="planTypeFilter"
                    value={planTypeFilter}
                    onChange={(e) => setPlanTypeFilter(e.target.value)}
                    options={[
                      { value: "", label: "All" },
                      { value: "monthly", label: "Monthly" },
                      { value: "half_yearly", label: "Half Yearly" },
                      { value: "yearly", label: "Yearly" },
                    ]}
                  />
                </div>

                <div className="w-full sm:w-[283px]">
                  <SelectMenuComp
                    label="Status"
                    name="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                      { value: "", label: "All" },
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ]}
                  />
                </div>

                <div className="w-full sm:w-[283px]">
                  <SearchBarComp
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full sm:w-[254px]">
                <ButtonComp
                  variant="contained"
                  sx={{
                    width: "100%",
                    height: "60px",
                  }}
                  onClick={handleOpen}
                >
                  Add New Subscription Plan
                </ButtonComp>
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            className="overflow-x-auto rounded-lg mx-auto container-3xl"
            style={{
              marginTop: "clamp(20px, 2vh, 32px)",
              padding: "0 clamp(16px, 2vw, 25px)",
            }}
          >
            <TableDataComp
              columns={columns}
              data={filteredPlans}
              actions={actions}
            />
          </div>

          {/* Form Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            disableRestoreFocus
            fullWidth
            maxWidth="xl"
            slotProps={{
              paper: {
                sx: {
                  width: {
                    xs: "calc(100% - 32px)",
                    sm: "90%",
                    md: "85%",
                    lg: "clamp(900px, 80vw, 1280px)",
                  },
                  margin: {
                    xs: "16px",
                    sm: "32px auto",
                    md: "40px auto",
                  },
                  borderRadius: {
                    xs: "16px",
                    sm: "20px",
                    md: "22px",
                  },
                  padding: {
                    xs: "16px",
                    sm: "20px",
                    md: "24px",
                  },
                  height: "auto",
                  minHeight: {
                    xs: "300px",
                    sm: "350px",
                  },
                  maxHeight: {
                    xs: "calc(100vh - 32px)",
                    sm: "90vh",
                    md: "85vh",
                  },
                  overflow: "hidden",
                },
              },
            }}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <DialogTitle
              sx={{
                fontWeight: "800",
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                  md: "22px",
                  lg: "24px",
                },
                color: "#012622",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: {
                  xs: "16px 16px 12px 16px",
                  sm: "20px 20px 16px 20px",
                  md: "24px 24px 16px 24px",
                },
              }}
            >
              {viewMode
                ? "View Subscription"
                : editingId
                ? "Edit Subscription"
                : "Add New Subscription"}
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "#012622",
                  width: {
                    xs: "36px",
                    sm: "40px",
                    md: "44px",
                  },
                  height: {
                    xs: "36px",
                    sm: "40px",
                    md: "44px",
                  },
                  padding: 0,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <CloseIcon
                  sx={{
                    fontSize: {
                      xs: "20px",
                      sm: "22px",
                      md: "24px",
                    },
                  }}
                />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                padding: {
                  xs: "16px",
                  sm: "20px",
                  md: "24px 32px",
                },
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {/* Main Form Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  width: "100%",
                  // backgroundColor: "red",
                  marginTop: "5px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <FormFieldComp
                    label="Plan Name"
                    name="planName"
                    value={form.planName}
                    onChange={handleChange}
                    error={!!errors.planName}
                    helperText={errors.planName || ""}
                    disabled={viewMode}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <FormFieldComp
                    label="Amount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    error={!!errors.amount}
                    helperText={errors.amount || ""}
                    disabled={viewMode}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <FormFieldComp
                    label="Maximum Standard Pick-ups"
                    name="standardPickups"
                    value={form.standardPickups}
                    onChange={handleChange}
                    error={!!errors.standardPickups}
                    helperText={errors.standardPickups || ""}
                    disabled={viewMode}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <FormFieldComp
                    label="Per Tyre Amount"
                    name="perTyreAmount"
                    value={form.perTyreAmount}
                    onChange={handleChange}
                    error={!!errors.perTyreAmount}
                    helperText={errors.perTyreAmount || ""}
                    disabled={viewMode}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <SelectMenuComp
                    label="Type of Plan"
                    name="planType"
                    value={form.planType}
                    onChange={handleChange}
                    error={!!errors.planType}
                    helperText={errors.planType || ""}
                    options={[
                      { value: "monthly", label: "monthly" },
                      { value: "half_yearly", label: "half_yearly" },
                      { value: "yearly", label: "yearly" },
                    ]}
                    disabled={viewMode}
                    sx={{ maxWidth: "334px" }}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <DatePickerComp
                    label="Plan Activation Date"
                    value={
                      form.planActivationDate
                        ? dayjs(form.planActivationDate)
                        : null
                    }
                    isActive
                    onChange={(newValue) =>
                      setForm((prev) => ({
                        ...prev,
                        planActivationDate: newValue ? dayjs(newValue) : null,
                      }))
                    }
                    placeholder="Select Activation Date"
                    error={!!errors.planActivationDate}
                    helperText={errors.planActivationDate || ""}
                    disabled={viewMode}
                    className="bg-[#E5E5E5]"
                    maxWidth="334px"
                  />
                </div>

                <div style={{ minWidth: 0 }}>
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
                    sx={{ maxWidth: "334px" }}
                  />
                </div>
              </div>

              {/* Express Pickups Toggle */}
              <div className="flex items-center gap-2 mt-5">
                <span className="text-sm md:text-base font-medium">
                  Express Pickups
                </span>
                <Switch
                  checked={express}
                  onChange={() => setExpress((s) => !s)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#003B36",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#003B36",
                    },
                  }}
                  disabled={viewMode}
                />
              </div>

              {/* Express Pickups Fields */}
              {express && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    width: "100%",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <FormFieldComp
                      label="Maximum Number of Express Pickups"
                      name="expressPickups"
                      value={form.expressPickups}
                      onChange={handleChange}
                      error={!!errors.expressPickups}
                      helperText={errors.expressPickups || ""}
                      disabled={viewMode}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <FormFieldComp
                      label="Per Tyre Amount of Express Pickups"
                      name="expressTyreAmount"
                      value={form.expressTyreAmount}
                      onChange={handleChange}
                      error={!!errors.expressTyreAmount}
                      helperText={errors.expressTyreAmount || ""}
                      disabled={viewMode}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}></div>
                </div>
              )}
            </DialogContent>

            {!viewMode && (
              <DialogActions
                sx={{
                  justifyContent: "center",
                  gap: "12px",
                  paddingBottom: {
                    xs: "16px",
                    sm: "20px",
                    md: "24px",
                  },
                  paddingX: {
                    xs: "16px",
                    sm: "20px",
                    md: "24px",
                  },
                  flexWrap: "wrap",
                }}
              >
                <ButtonComp
                  variant="contained"
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "140px",
                    },
                    height: "52px",
                    minWidth: "120px",
                  }}
                  onClick={handleSave}
                >
                  Save
                </ButtonComp>
                <ButtonComp
                  variant="outlined"
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "140px",
                    },
                    height: "52px",
                    minWidth: "120px",
                    marginLeft: "0 !important",
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </ButtonComp>
              </DialogActions>
            )}
          </Dialog>
        </>
      )}

      {/*  Delete Confirmation Dialog */}
      <DeleteConfirmationPrompt
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Subscription Plan"
        message="Are you sure you want to delete this subscription plan? All of its data will be permanently removed. This action cannot be undone."
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontSize: "clamp(13px, 0.9vw, 15px)",
            padding: "clamp(8px, 1vh, 12px) clamp(12px, 1.5vw, 16px)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SubscriptionPlan;
