import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoId: '',
  connected: false,
  videoTitle: '',
  nickName: null,
  role: null,
  users: [],
  adminId: null,
  userId: null,
  changeTime: null,
};

export const logicSlice = createSlice({
  name: 'logic',
  initialState,
  reducers: {
    setVideoId: (state, action) => {
      state.videoId = action.payload;
    },
    setConnect: (state) => {
      state.connected = true;
    },
    setDisconnect: (state) => {
      state.connected = false;
    },
    setVideoTitle: (state, action) => {
      state.videoTitle = action.payload;
    },
    setNickName: (state, action) => {
      state.nickName = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setAdminTime: (state, action) => {
      state.adminId = action.payload;
    },
    setUserTime: (state, action) => {
      state.userId = action.payload;
    },
    setClearAdmintime: (state) => {
      clearInterval(state.adminId);
    },
    setClearUsertime: (state) => {
      clearInterval(state.userId);
    },
    setChangePauseTime: (state, action) => {
      state.changeTime = action.payload;
    },
    setClearChangePauseTime: (state) => {
      clearInterval(state.changeTime);
    },
  },
});

export const {
  setVideoId,
  setConnect,
  setDisconnect,
  setVideoTitle,
  setNickName,
  setRole,
  setUsers,
  setAdminTime,
  setClearAdmintime,
  setUserTime,
  setClearUsertime,
  setChangePauseTime,
  setClearChangePauseTime,
} = logicSlice.actions;

export default logicSlice.reducer;
