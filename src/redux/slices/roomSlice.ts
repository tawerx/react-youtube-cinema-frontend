import { createSlice } from "@reduxjs/toolkit";
import type { getUsersDTO } from "../../shared/types";

interface initState {
  roomId: string | null;
  videoId: string | null;
  videoTitle: string | null;
  channel: string | null;
  users: getUsersDTO[];
  adminId: number | null;
  userId: number | null;
  changeTime: any;
}

const initialState: initState = {
  roomId: null,
  videoId: "",
  videoTitle: "",
  channel: "",
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
    setChannel: (state, action) => {
      state.channel = action.payload;
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
      state.adminId && clearInterval(state.adminId);
    },
    setClearUsertime: (state) => {
      state.userId && clearInterval(state.userId);
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
      const time = action.payload;
      state.users = state.users.map((user) => {
        user.currentTimeMs = time;
        return user;
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
  setChannel,
} = roomSlice.actions;

export default roomSlice.reducer;
