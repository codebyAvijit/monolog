export const userValidationConfig = {
  userName: { required: true, requiredMessage: "User Name is Required" },
  phoneNumber: {
    required: true,
    type: "number",
    requiredMessage: "Phone Number is required",
    typeErrorMessage: "Phone Number should be a valid number",
  },
  email: {
    required: true,
    type: "email",
    requiredMessage: "Email is required",
    typeErrorMessage: "Please enter a valid email address",
  },
  role: {
    required: true,
    requiredMessage: "Role is required",
  },
};
