// utils/validation.js
export const validateFields = (values, config, extraOptions = {}) => {
  const errors = {};
  const regexNum = /^\d+$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const field in config) {
    const { required, type, requiredMessage, typeErrorMessage } = config[field];
    const value = values[field];

    // Required check
    if (required && (!value || (typeof value === "string" && !value.trim()))) {
      errors[field] = requiredMessage || `${field} is required`;
      continue; // skip type check if required fails
    }

    // Type checks
    if (value) {
      if (type === "number" && isNaN(Number(value))) {
        errors[field] = typeErrorMessage || `${field} should be a valid number`;
      } else if (type === "email" && !regexEmail.test(value)) {
        errors[field] = typeErrorMessage || "Invalid email address";
      }
    }
  }

  // Extra options for dynamic fields (like Express Pickups)
  if (extraOptions.expressEnabled) {
    if (extraOptions.expressPickupsRequired) {
      const val = values.expressPickups;
      if (!val || val.toString().trim() === "") {
        errors.expressPickups = "Express Pickups are required";
      } else if (isNaN(Number(val))) {
        errors.expressPickups = "Express Pickups should be a valid number";
      }
    }

    if (extraOptions.expressAmountRequired) {
      const val = values.expressTyreAmount;
      if (!val || val.toString().trim() === "") {
        errors.expressTyreAmount = "Express Per Tyre Amount is required";
      } else if (isNaN(Number(val))) {
        errors.expressTyreAmount =
          "Express Per Tyre Amount should be a valid number";
      }
    }
  }

  return errors;
};
