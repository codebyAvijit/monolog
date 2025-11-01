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
    alignItems: "center",
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
          alignItems: "center",
        });
      } else {
        await dispatch(createSubscriptionPlan(payload)).unwrap();
        setSnackbar({
          open: true,
          message: "Plan created successfully",
          alignItems: "center",
        });
      }
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message || "Operation failed"}`,
      });
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to proceed?")) {
      try {
        await dispatch(deleteSubscriptionPlan(id)).unwrap();
        setSnackbar({ open: true, message: "Plan deleted successfully" });
        await dispatch(fetchSubscriptionPlans()).unwrap();
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Error: ${error.message || "Deletion failed"}`,
        });
      }
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
      onClick: (row) => deleteItem(row.id),
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
          {/* Filters Section - Responsive */}
          <div className="flex flex-wrap gap-5 justify-between items-end w-full">
            {/* Left group: Plan Type + Status + Search Bar */}
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-[334px]">
                <SelectMenuComp
                  label="Plan Type"
                  name="planTypeFilter"
                  value={planTypeFilter}
                  onChange={(e) => setPlanTypeFilter(e.target.value)}
                  options={[
                    { value: "", label: "All" },
                    { value: "standard", label: "Standard" },
                    { value: "premium", label: "Premium" },
                  ]}
                  sx={{ borderRadius: "10px" }}
                />
              </div>
              <div className="w-full sm:w-[334px]">
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
                  sx={{ borderRadius: "10px" }}
                />
              </div>
              <div className="w-full sm:w-[334px]">
                <SearchBarComp
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right side: Button */}
            <div className="w-full sm:w-auto">
              <ButtonComp
                variant="contained"
                width="standard"
                sx={{
                  height: { xs: "50px", md: "60px" },
                  fontSize: { xs: "14px", md: "16px" },
                  width: { xs: "100%", sm: "auto" },
                }}
                onClick={handleOpen}
              >
                Add New Subscription Plan
              </ButtonComp>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-5 shadow rounded-lg">
            <TableDataComp
              columns={columns}
              data={filteredPlans}
              actions={actions}
            />
          </div>

          {/* Dialog - Responsive */}
          <Dialog
            open={open}
            onClose={handleClose}
            disableRestoreFocus
            fullWidth
            maxWidth="xl"
            slotProps={{
              paper: {
                sx: {
                  width: { xs: "95%", sm: "90%", md: "85%" },
                  maxWidth: "1280px",
                  height: { xs: "auto", md: "598px" },
                  maxHeight: { xs: "90vh", md: "90vh" },
                  margin: { xs: "8px", sm: "16px" },
                  borderRadius: "12px",
                  p: 0,
                  display: "flex",
                  flexDirection: "column",
                },
              },
            }}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <DialogTitle
              sx={{
                fontWeight: "600",
                fontSize: { xs: "18px", md: "20px", lg: "24px" },
                color: "#012622",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: { xs: "16px", sm: "20px" },
              }}
            >
              {viewMode
                ? "View Subscription"
                : editingId
                ? "Edit Subscription"
                : "Add New Subscription"}
              <IconButton
                onClick={handleClose}
                sx={{ color: "#012622", ml: 2 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                flex: 1,
                overflow: "auto",
                px: { xs: 2, sm: 3 },
                py: 2,
              }}
            >
              {/* Main Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-6 pt-2">
                <FormFieldComp
                  label="Plan Name"
                  name="planName"
                  value={form.planName}
                  onChange={handleChange}
                  error={!!errors.planName}
                  helperText={errors.planName || ""}
                  disabled={viewMode}
                />
                <SelectMenuComp
                  label="Plan Type"
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
                />

                <FormFieldComp
                  label="Amount"
                  name="amount"
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
                  value={form.standardPickups}
                  onChange={handleChange}
                  error={!!errors.standardPickups}
                  helperText={errors.standardPickups || ""}
                  disabled={viewMode}
                />
                <FormFieldComp
                  label="Per Tyre Amount"
                  name="perTyreAmount"
                  value={form.perTyreAmount}
                  onChange={handleChange}
                  error={!!errors.perTyreAmount}
                  helperText={errors.perTyreAmount || ""}
                  disabled={viewMode}
                />
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
                />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mt-5">
                  <FormFieldComp
                    label="Maximum Number of Express Pickups"
                    name="expressPickups"
                    value={form.expressPickups}
                    onChange={handleChange}
                    error={!!errors.expressPickups}
                    helperText={errors.expressPickups || ""}
                    disabled={viewMode}
                  />
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
              )}
            </DialogContent>

            {!viewMode && (
              <DialogActions
                sx={{
                  justifyContent: "center",
                  gap: { xs: 2, sm: 3 },
                  pb: { xs: 2, sm: 3 },
                  px: { xs: 2, sm: 3 },
                  flexWrap: "wrap",
                }}
              >
                <ButtonComp
                  variant="contained"
                  sx={{
                    width: { xs: "100%", sm: "120px" },
                    height: { xs: "50px", md: "60px" },
                    fontSize: { xs: "14px", md: "16px" },
                    borderRadius: "6px",
                  }}
                  onClick={handleSave}
                >
                  Save
                </ButtonComp>
                <ButtonComp
                  variant="outlined"
                  sx={{
                    width: { xs: "100%", sm: "120px" },
                    height: { xs: "50px", md: "60px" },
                    fontSize: { xs: "14px", md: "16px" },
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
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default SubscriptionPlan;
