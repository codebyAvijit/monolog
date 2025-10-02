import { createSlice } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "mainPostCodeArray";

const initialState = {
  postCodes: loadFromLocalStorage(STORAGE_KEY, []),
};

const postCodeSlice = createSlice({
  name: "postCode",
  initialState,
  reducers: {
    addPostCode: (state, action) => {
      const newPostCode = {
        id: crypto.randomUUID(),
        ...action.payload,
      };
      state.postCodes.push(newPostCode);
      saveToLocalStorage(STORAGE_KEY, state.postCodes);
    },
    deletePostCode: (state, action) => {
      state.postCodes = state.postCodes.filter(
        (user) => user.id !== action.payload
      );
      saveToLocalStorage(STORAGE_KEY, state.postCodes);
    },
    updatePostCode: (state, action) => {
      const index = state.postCodes.findIndex(
        (u) => u.id === action.payload.id
      );
      if (index !== -1) {
        state.postCodes[index] = {
          ...state.postCodes[index],
          ...action.payload,
        };
        saveToLocalStorage(STORAGE_KEY, state.postCodes);
      }
    },
    setPostCodes: (state, action) => {
      state.postCodes = action.payload;
      saveToLocalStorage(STORAGE_KEY, state.postCodes);
    },
  },
});

export const { addPostCode, deletePostCode, updatePostCode, setPostCodes } =
  postCodeSlice.actions;

export default postCodeSlice.reducer;
