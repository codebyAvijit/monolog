import React, { useState } from "react";
import SelectMenuComp from "./reusableComps/SelectMenuComp";
import ButtonComp from "./reusableComps/ButtonComp";
import TableDataComp from "./reusableComps/TableDataComp";
import SearchBarComp from "./reusableComps/SearchBarComp";
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit.svg";
import CloseIcon from "@mui/icons-material/Close";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import FormFieldComp from "./reusableComps/FormFieldComp";

const PostCode = () => {
  const [open, setOpen] = useState(false);
  const [postCodes, setPostCodes] = useState("");
  const [postCodeFilter, setPostCodeFilter] = useState(""); // default none
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [form, setForm] = useState({
    postCodeLocation: "",
    locationName: "",
  });

  const handleSave = () => {
    console.log("Saved:", form);
    // reset after save
    setForm({
      postCodeLocation: "",
      locationName: "",
    });
    handleClose();
  };

  const columns = [
    { key: "postCode", label: "Postcode" },
    { key: "locationName", label: "Location name" },
  ];

  const data = [
    {
      postCode: "WC2N 5DN",
      locationName: "Trafalgar Square",
    },
    {
      postCode: "WC2N 5DN",
      locationName: "Piccadilly Circus",
    },
    {
      postCode: "WC2N 5DN",
      locationName: "Big Ben (Westminster)",
    },
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
      onClick: (row) => console.log("Edit", row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      onClick: (row) => console.log("Delete", row),
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
        <TableDataComp columns={columns} data={data} actions={actions} />
      </div>
      <Dialog
        open={open}
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
          <div className="flex flex-row gap-4">
            <SelectMenuComp
              label="Postcode"
              name="postCodeLocation"
              value={form.postCodeLocation}
              onChange={handleChange}
              options={[
                { value: "WC2N 5DN-1", label: "WC2N 5DN" },
                { value: "WC2N 5DN-2", label: "WC2N 5DN" },
              ]}
            />

            <FormFieldComp
              label="Location Name"
              name="locationName"
              // fullWidth
              value={form.locationName}
              onChange={handleChange}
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
