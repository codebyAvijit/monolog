// Import necessary libraries and components
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
import searchIcon from "../../assets/icons/search.svg";
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
  DialogActions,
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
// console.log(fetchPostCodesData);
const PostCode = () => {
  const dispatch = useDispatch();
  // const mainPostCodeArray = useSelector((state) => state.postCode.postCodes);
  const { postCodes, loading } = useSelector((state) => state.postCode);
  // console.log("PostCodes from Redux:", postCodes);
  const [open, setOpen] = useState(false);
  const [postCode, setPostCodes] = useState(postCodes);
  const [postCodeFilter, setPostCodeFilter] = useState(""); // default none

  const [errors, setErrors] = useState({});

  const [options, setOptions] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //use state for view mode

  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    dispatch(fetchPostCodesData());
  }, [dispatch]);

  //SETING UP STATE FOR IMPLEMENTING EDITING FUNCTIONALITY USING REDUX

  const [editingId, setEditingId] = useState("");

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

  //pseudo code
  // 1. Run validation
  // 2. If there are errors, show them and stop
  // 3. If no errors, save data
  // 4. Close modal and reset form

  const handleOpen = async () => {
    setForm(resetForm());
    setErrors({});
    setEditingId("");
    setOpen(true);

    try {
      const result = await dispatch(searchPostCodes({ query: "" })).unwrap();

      if (result && Array.isArray(result)) {
        setOptions(result); // directly store string array
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleClose = () => {
    // console.log("Closing modal...");
    setOpen(false); // closes modal
    setErrors({});
    setForm(resetForm()); // reset form fields
    setEditingId(""); // reset edit mode
    // setViewMode(false); // reset view mode
  };

  const [form, setForm] = useState({
    // id: crypto.randomUUID(),
    postCodeLocation: "",
    locationName: "",
  });

  const resetForm = () => ({
    // id: crypto.randomUUID(),
    postCodeLocation: "",
    locationName: "",
  });

  const handleSave = async () => {
    const validationErrors = validateFields(form, postCodeValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    //  Check for duplicate, excluding current edit
    const duplicate = postCodes.some(
      (pc) =>
        pc.postCodeLocation?.trim().toLowerCase() ===
          form.postCodeLocation?.trim().toLowerCase() && pc._id !== editingId // or pc.id if that's what your backend uses
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
        //  Update logic
        await dispatch(updatePostCode({ id: editingId, ...form })).unwrap();
        await dispatch(fetchPostCodesData()).unwrap(); //  refresh data
        setSnackbar({
          open: true,
          message: "Postcode updated successfully!",
          severity: "success",
        });
      } else {
        //  Create logic
        await dispatch(createPostCode(form)).unwrap();
        await dispatch(fetchPostCodesData()).unwrap(); //  refresh data
        setSnackbar({
          open: true,
          message: "Postcode created successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Operation failed. Try again.",
        severity: "error",
      });
    }

    setEditingId("");
    handleClose();
  };

  //EDITING

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  //REPLACINF DELETE LOGIC WITH REDUX

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this postcode?");
    if (!confirmed) return;

    try {
      await dispatch(deletePostCode(id)).unwrap();
      await dispatch(fetchPostCodesData()).unwrap(); // Refresh data

      setSnackbar({
        open: true,
        message: "Postcode deleted successfully!",
        severity: "info",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete postcode.",
        severity: "error",
      });
    }
  };

  const columns = [
    { key: "postCodeLocation", label: "Postcode" },
    { key: "locationName", label: "Location name" },
  ];

  const actions = [
    // {
    //   icon: eyeOpen,
    //   label: "View",
    //   onClick: (row) => console.log("View", row),
    // },
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
      onClick: (row) => handleDelete(row.id),
    },
  ];

  // console.log("postCodes", postCodes);

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-between items-end w-full">
        {/* Left group: Postcode + Search Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="Postcode"
              name="postCodeFilter"
              value={postCodeFilter}
              onChange={(e) => setPostCodeFilter(e.target.value)}
              options={[
                { value: "WC2N 5DN-1", label: "WC2N 5DN" },
                { value: "WC2N 5DN-2", label: "WC2N 5DN" },
              ]}
            />
          </div>
          <div className="w-full sm:w-[334px]">
            <SearchBarComp />
          </div>
        </div>

        {/* Right side: Button */}
        <div className="w-full sm:w-auto">
          <ButtonComp
            variant="contained"
            sx={{
              fontSize: "16px",
              borderRadius: "6px",
              width: { xs: "100%", sm: "154px" },
            }}
            onClick={handleOpen}
          >
            Add New Postcode
          </ButtonComp>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg mt-5">
        <TableDataComp columns={columns} data={postCodes} actions={actions} />
      </div>
      <Dialog
        open={open}
        disableRestoreFocus
        onClose={handleClose}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxWidth: "788px",
              borderRadius: "22px",
              p: 3,
              height: "350px",
            },
          },
        }}
      >
        {/* Header */}
        <DialogTitle className="flex justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]">
          {editingId ? "Edit Postcode" : "Add New Postcode"}
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Body */}
        <DialogContent>
          <div className="flex gap-4 p-2 justify-between">
            {/* Postcode Search */}
            <SearchWithDropDown
              value={form.postCodeLocation}
              onChange={handleChange}
              error={!!errors.postCodeLocation}
              helperText={errors.postCodeLocation}
              existingPostCodes={postCodes.map((p) => p.postCodeLocation)}
              defaultPostCodes={options} //  use options from state
            />

            {/* Location Name Field */}
            <FormFieldComp
              label="Location Name"
              name="locationName"
              value={form.locationName}
              onChange={handleChange}
              error={!!errors.locationName}
              helperText={errors.locationName || ""}
            />
          </div>

          {/* Buttons placed INSIDE DialogContent */}
          <div className="flex justify-center gap-4 mt-8">
            <ButtonComp
              variant="contained"
              sx={{
                width: "120px",
                height: "50px",
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
                height: "50px",
                fontSize: "16px",
                borderRadius: "6px",
              }}
              onClick={handleClose}
            >
              Cancel
            </ButtonComp>
          </div>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostCode;
