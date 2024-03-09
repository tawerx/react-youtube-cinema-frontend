import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  videoId: "",
  videoTitle: "",
  users: [],
  adminId: null,
  userId: null,
  changeTime: null,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setVideoId: (state, action) => {
      state.videoId = action.payload;
    },
    setVideoTitle: (state, action) => {
      state.videoTitle = action.payload;
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
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setUsersTime: (state, action) => {
      const newUsers = action.payload;
      newUsers.forEach(({ user_id, current_video_time }) => {
        state.users.forEach((obj) => {
          if (obj.user_id == user_id) {
            obj.current_video_time = current_video_time;
          }
        });
      });
    },
  },
});

export const {
  setVideoId,
  setVideoTitle,
  setUsers,
  setAdminTime,
  setClearAdmintime,
  setUserTime,
  setClearUsertime,
  setChangePauseTime,
  setClearChangePauseTime,
  setRoomId,
  setUsersTime,
} = roomSlice.actions;

export default roomSlice.reducer;
