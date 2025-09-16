import { createSlice } from "@reduxjs/toolkit";
import type { UserRole } from "../../shared/types";

export type initState = {
  nickName: string | null;
  role: UserRole | null;
};

const initialState: initState = {
  nickName: null,
  role: null,
};

export const personalSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    setNickName: (state, action) => {
      state.nickName = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setNickName, setRole } = personalSlice.actions;

export default personalSlice.reducer;
