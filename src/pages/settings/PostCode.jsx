// Import necessary libraries and components
import React, { useState } from "react";
import { validateFields } from "../../utils/validation";
import { postCodeValidationConfig } from "../../utils/postCodeConfig";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  addPostCode,
  deletePostCode,
  updatePostCode,
  setPostCodes,
} from "../../redux/postCodeSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";

const validateAllFields = (values) => {
  return validateFields(values, postCodeValidationConfig);
};

const PostCode = () => {
  const dispatch = useDispatch();
  const mainPostCodeArray = useSelector((state) => state.postCode.postCodes);
  const [open, setOpen] = useState(false);
  // const [postCodes, setPostCodes] = useState("");
  const [postCodeFilter, setPostCodeFilter] = useState(""); // default none

  const [errors, setErrors] = useState({});

  //use state for view mode

  const [viewMode, setViewMode] = useState(false);

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // console.log("Closing modal...");
    setOpen(false); // closes modal
    setErrors({});
    setForm(resetForm()); // reset form fields
    setEditingId(""); // reset edit mode
    // setViewMode(false); // reset view mode
  };

  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    postCodeLocation: "",
    locationName: "",
  });

  const resetForm = () => ({
    id: crypto.randomUUID(),
    postCodeLocation: "",
    locationName: "",
  });

  const handleSave = () => {
    // console.log("Saved form before validation:", form);

    // 1. Run validation
    const validationErrors = validateFields(form, postCodeValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 2. If editing → update, else → add new
    if (editingId) {
      // console.log("Updating user with id:", editingId);
      dispatch(updatePostCode({ id: editingId, ...form }));
    } else {
      // console.log("Adding new user");
      dispatch(addPostCode(form));
    }

    // 3. Reset editingId BEFORE closing
    setEditingId("");

    // 4. Close modal (reset form, clear errors, hide dialog)
    handleClose();

    // console.log("Saved successfully & modal closed");
  };

  //EDITING

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  //REPLACINF DELETE LOGIC WITH REDUX

  const handleDelete = (id) => {
    dispatch(deletePostCode(id));
  };

  const columns = [
    { key: "postCodeLocation", label: "Postcode" },
    { key: "locationName", label: "Location name" },
  ];

  // const data = [
  //   {
  //     postCode: "WC2N 5DN",
  //     locationName: "Trafalgar Square",
  //   },
  //   {
  //     postCode: "WC2N 5DN",
  //     locationName: "Piccadilly Circus",
  //   },
  //   {
  //     postCode: "WC2N 5DN",
  //     locationName: "Big Ben (Westminster)",
  //   },
  // ];

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
      // onClick: (row) => console.log("Delete", row),
      onClick: (row) => {
        let confirmation = confirm("Are you sure you want to proceed?");
        if (confirmation) {
          alert("You chose to proceed.");
          handleDelete(row.id);
        } else {
          alert("You cancelled the action.");
        }
      },
    },
  ];
  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div className="flex gap-6 w-full">
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

          <SearchBarComp />
        </div>

        {/* Reusable ButtonComp */}
        <ButtonComp
          variant="contained"
          sx={{
            fontSize: "16px",
            borderRadius: "6px",
          }}
          onClick={handleOpen}
        >
          Add New Postcode
        </ButtonComp>
      </div>
      <div className="overflow-x-auto shadow rounded-lg">
        <TableDataComp
          columns={columns}
          data={mainPostCodeArray}
          actions={actions}
        />
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
              maxHeight: "none",
            },
          },
        }}
      >
        <DialogTitle className="flex flex-row justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]">
          Add New Postcode
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="flex p-2 flex-row gap-4">
            <SelectMenuComp
              label="Postcode"
              name="postCodeLocation"
              value={form.postCodeLocation}
              onChange={handleChange}
              options={[
                { value: "WC2N 5DN-1", label: "WC2N 5DN" },
                { value: "WC2N 5DN-2", label: "WC2N 5DN" },
              ]}
              error={!!errors.postCodeLocation}
              helperText={errors.postCodeLocation || ""}
            />

            <FormFieldComp
              label="Location Name"
              name="locationName"
              // fullWidth
              value={form.locationName}
              onChange={handleChange}
              error={!!errors.locationName}
              helperText={errors.locationName || ""}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 2 }}>
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCode;
