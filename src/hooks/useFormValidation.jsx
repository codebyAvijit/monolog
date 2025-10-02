// Import necessary libraries and components
import { useState } from "react";

const useFormValidation = (initialValues, validateFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (input) => {
    if (input?.target) {
      // Normal text fields
      setValues({ ...values, [input.target.name]: input.target.value });
    } else if (typeof input === "object" && input.name) {
      // Custom components (like OTPInput)
      setValues({ ...values, [input.name]: input.value });
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    const newErrors = validateFn(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      callback(); // Run your onSubmit logic
    }
  };

  return { values, errors, handleChange, handleSubmit };
};

export default useFormValidation;
