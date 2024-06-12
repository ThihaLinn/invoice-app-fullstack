import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { act } from "react";

interface AlertSlice {
  isOpen: boolean;
  message: string;
  color: string;
}

const initialState: AlertSlice = {
  isOpen: false,
  message: "",
  color: "",
};

export const alertSlice = createSlice({
  name: "Alert",
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<AlertSlice>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.color = action.payload.color;
    },
    setClose: (state) => {
      state.isOpen = false;
      state.message = "";
      state.color = "";
    },
  },
});

export const { setOpen, setClose } = alertSlice.actions;

export default alertSlice.reducer;
