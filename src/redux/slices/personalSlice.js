import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connected: false,
  nickName: null,
  role: null,
};

export const personalSlice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    setConnect: (state) => {
      state.connected = true;
    },
    setDisconnect: (state) => {
      state.connected = false;
    },
    setNickName: (state, action) => {
      state.nickName = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setConnect, setDisconnect, setNickName, setRole } = personalSlice.actions;

export default personalSlice.reducer;
