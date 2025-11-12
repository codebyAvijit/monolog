// src/pages/PostCode.jsx
import React, { useEffect, useState } from "react";
import { validateFields } from "../../utils/validation";
import { postCodeValidationConfig } from "../../utils/postCodeConfig";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchPostCodesData,
  createPostCode,
  updatePostCode,
  deletePostCode,
  searchPostCodes,
} from "../../redux/postCodeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";
import SearchWithDropDown from "../../components/reusableComps/SearchWithDropDown";

const validateAllFields = (values) => {
  return validateFields(values, postCodeValidationConfig);
};

const PostCode = () => {
  const dispatch = useDispatch();
  const { postCodes, loading } = useSelector((state) => state.postCode);

  const [open, setOpen] = useState(false);
  const [postCodeFilter, setPostCodeFilter] = useState("");
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({
    postCodeLocation: "",
    locationName: "",
  });

  //  Initial data fetch on mount
  useEffect(() => {
    dispatch(fetchPostCodesData());
  }, [dispatch]);

  const resetForm = () => ({
    postCodeLocation: "",
    locationName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    const fieldError =
      validateAllFields({ ...form, [name]: value })[name] || "";
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleOpen = async () => {
    setForm(resetForm());
    setErrors({});
    setEditingId("");
    setOpen(true);

    try {
      const result = await dispatch(searchPostCodes({ query: "" })).unwrap();
      if (result && Array.isArray(result)) {
        setOptions(result);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setForm(resetForm());
    setEditingId("");
  };

  // ========== SAVE (CREATE or UPDATE) ==========
  const handleSave = async () => {
    const validationErrors = validateFields(form, postCodeValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const duplicate = postCodes.some(
      (pc) =>
        pc.postCodeLocation?.trim().toLowerCase() ===
          form.postCodeLocation?.trim().toLowerCase() && pc.id !== editingId
    );

    if (duplicate) {
      setSnackbar({
        open: true,
        message: "Postcode already exists! Try again with a new postcode.",
        severity: "error",
      });
      return;
    }

    try {
      if (editingId) {
        //  UPDATE - Redux updates in place (real-time)
        await dispatch(updatePostCode({ id: editingId, ...form })).unwrap();
        setSnackbar({
          open: true,
          message: "Postcode updated successfully!",
          severity: "success",
        });
      } else {
        //  CREATE - Redux adds to end (real-time)
        await dispatch(createPostCode(form)).unwrap();
        setSnackbar({
          open: true,
          message: "Postcode created successfully!",
          severity: "success",
        });
      }
      //  No fetch needed - Redux handles state updates automatically
    } catch (error) {
      console.error("Save error:", error);
      setSnackbar({
        open: true,
        message: error?.message || "Operation failed. Try again.",
        severity: "error",
      });
    }

    setEditingId("");
    handleClose();
  };

  // ========== DELETE ==========
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this postcode?");
    if (!confirmed) return;

    try {
      //  DELETE - Redux removes from array (real-time)
      await dispatch(deletePostCode(id)).unwrap();

      setSnackbar({
        open: true,
        message: "Postcode deleted successfully!",
        severity: "info",
      });
      //  No fetch needed - Redux handles state updates automatically
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: error?.message || "Failed to delete postcode.",
        severity: "error",
      });
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  const columns = [
    { key: "postCodeLocation", label: "Postcode" },
    { key: "locationName", label: "Location name" },
  ];

  const actions = [
    {
      icon: editIcon,
      label: "Edit",
      onClick: (row) => handleEdit(row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <>
      {/* Header Section */}
      <div
        className="w-full mx-auto container-3xl"
        style={{ padding: "clamp(16px, 2vw, 25px)" }}
      >
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="w-full sm:w-auto flex flex-wrap gap-4">
            {/* Postcode Select */}
            <div className="w-full sm:w-[283px]">
              <SelectMenuComp
                label="Postcode"
                name="postCodeFilter"
                value={postCodeFilter}
                onChange={(e) => setPostCodeFilter(e.target.value)}
                options={[
                  { value: "", label: "All" },
                  { value: "WC2N 5DN-1", label: "WC2N 5DN" },
                  { value: "WC2N 5DN-2", label: "WC2N 5DN" },
                ]}
              />
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-[283px]">
              <SearchBarComp />
            </div>
          </div>

          {/* Right side: Button */}
          <div className="w-full sm:w-[194px]">
            <ButtonComp
              variant="contained"
              sx={{
                width: "100%",
                height: "60px",
              }}
              onClick={handleOpen}
            >
              Add New Postcode
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
        <TableDataComp columns={columns} data={postCodes} actions={actions} />
      </div>

      {/* Dialog */}
      <Dialog
        open={open}
        disableRestoreFocus
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "calc(100% - 32px)",
                sm: "90%",
                md: "clamp(600px, 70vw, 800px)",
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
          {editingId ? "Edit Postcode" : "Add New Postcode"}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Fields Container */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Postcode Field */}
              <div style={{ minWidth: 0 }}>
                <SearchWithDropDown
                  value={form.postCodeLocation}
                  onChange={handleChange}
                  error={!!errors.postCodeLocation}
                  helperText={errors.postCodeLocation}
                  existingPostCodes={postCodes.map((p) => p.postCodeLocation)}
                  defaultPostCodes={options}
                />
              </div>

              {/* Location Name Field */}
              <div style={{ minWidth: 0 }}>
                <FormFieldComp
                  label="Location Name"
                  name="locationName"
                  value={form.locationName}
                  onChange={handleChange}
                  error={!!errors.locationName}
                  helperText={errors.locationName || ""}
                  fullWidth
                />
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "8px",
              }}
              className="sm:flex-row justify-center"
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
                }}
                onClick={handleClose}
              >
                Cancel
              </ButtonComp>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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

export default PostCode;
