import { createSlice } from "@reduxjs/toolkit";
import type { getRequestUsersDTO, getUsersDTO } from "../../shared/types";

interface initState {
  roomId: string | null;
  videoId: string | null;
  videoTitle: string | null;
  channel: string | null;
  users: getUsersDTO[];
  requestUsers: getRequestUsersDTO[];
  duractionIso: string;
  duractionSec: number;
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
  requestUsers: [],
  duractionIso: "",
  duractionSec: 0,
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
    setUsers: (state, action: { payload: getUsersDTO[] }) => {
      state.users = action.payload.sort((a, b) =>
        b.user.socketId.localeCompare(a.user.socketId)
      );
    },
    setRequestUsers: (state, action: { payload: getRequestUsersDTO[] }) => {
      state.requestUsers = action.payload.sort((a, b) =>
        b.user.socketId.localeCompare(a.user.socketId)
      );
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
    setDuraction: (state, action) => {
      state.duractionIso = action.payload.duractionIso;
      state.duractionSec = action.payload.duractionSec;
    },
  },
});

export const {
  setVideoId,
  setVideoTitle,
  setUsers,
  setRequestUsers,
  setAdminTime,
  setClearAdmintime,
  setUserTime,
  setClearUsertime,
  setChangePauseTime,
  setClearChangePauseTime,
  setRoomId,
  setUsersTime,
  setChannel,
  setDuraction,
} = roomSlice.actions;

export default roomSlice.reducer;
