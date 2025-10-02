import { createSlice } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const STORAGE_KEY = "mainUserArray";

const initialState = {
  users: loadFromLocalStorage(STORAGE_KEY, []),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.users.push(newUser);
      saveToLocalStorage(STORAGE_KEY, state.users);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      saveToLocalStorage(STORAGE_KEY, state.users);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = {
          ...state.users[index],
          ...action.payload,
        };
        saveToLocalStorage(STORAGE_KEY, state.users);
      }
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      saveToLocalStorage(STORAGE_KEY, state.users);
    },
  },
});

export const { addUser, deleteUser, updateUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
