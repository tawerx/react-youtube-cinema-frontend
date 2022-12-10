import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoId: '',
  connected: false,
  videoTitle: '',
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
  },
});

export const { setVideoId, setConnect, setDisconnect, setVideoTitle } = logicSlice.actions;

export default logicSlice.reducer;
