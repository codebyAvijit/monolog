// src/api/apiHelpers.js
import axiosInstance from "./axiosConfig";

//  Utility: handle all API errors cleanly
const handleApiError = (error) => {
  if (!error.response) {
    // Network/timeout errors
    throw new Error(
      "Network error or timeout — no response received from server."
    );
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      throw new Error(data?.message || "Bad Request (400)");
    case 401:
      throw new Error(data?.message || "Unauthorized (401)");
    case 403:
      throw new Error(data?.message || "Forbidden (403)");
    case 404:
      throw new Error(data?.message || "Not Found (404)");
    case 500:
      throw new Error(data?.message || "Internal Server Error (500)");
    default:
      throw new Error(data?.message || `Unexpected Error (${status})`);
  }
};

//  GET Method
export const GetData = async (apiName, accessToken) => {
  try {
    const response = await axiosInstance.get(apiName, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response; // full axios response
  } catch (error) {
    handleApiError(error);
  }
};

//  POST Method
export const PostData = async (apiName, data, accessToken) => {
  try {
    const response = await axiosInstance.post(apiName, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

//  PUT Method
export const PutData = async (apiName, data, accessToken) => {
  try {
    const response = await axiosInstance.put(apiName, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

//  DELETE Method
export const DeleteData = async (apiName, accessToken) => {
  try {
    const response = await axiosInstance.delete(apiName, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
