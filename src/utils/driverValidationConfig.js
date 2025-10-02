// Driver validation config
export const driverValidationConfig = {
  driverName: { required: true, requiredMessage: "Driver Name is required" },
  phoneNumber: {
    required: true,
    type: "number",
    requiredMessage: "Phone Number is required",
  },
  email: { required: true, type: "email" },
  licenseNumber: { required: true },
  address: { required: true },
  vehicleNumber: { required: true },
  minTyresRequirement: { required: true, type: "number" },
  maxTyresCapacity: { required: true, type: "number" },
  licenseExpiryDate: { required: true },
  postCodesCovered: { required: true },
  vehicleType: { required: true },
  maxWeight: { required: true, type: "number" },
};
