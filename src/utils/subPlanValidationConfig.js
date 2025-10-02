// SubPlan validation config
export const subPlanValidationConfig = {
  planName: { required: true, requiredMessage: "Plan Name is Required" },
  planType: { required: true, requiredMessage: "Plan Type is Required" },
  amount: {
    required: true,
    type: "number",
    requiredMessage: "Amount is Required",
    typeErrorMessage: "Amount should be a valid number",
  },
  planStatus: {
    required: true,
    requiredMessage: "Please Select Appropriate Plan Status",
  },
  standardPickups: {
    required: true,
    type: "number",
    requiredMessage: "Standard Pickups is Required",
    typeErrorMessage: "Standard Pickups should be a valid number",
  },
  perTyreAmount: {
    required: true,
    type: "number",
    requiredMessage: "Per Tyre Amount is Required",
    typeErrorMessage: "Per Tyre Amount should be a valid number",
  },
  planActivationDate: {
    required: true,
    requiredMessage: "Plan Activation Date is Required",
  },
};
