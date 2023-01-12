import { configureStore } from '@reduxjs/toolkit';
import room from './slices/roomSlice.js';
import personal from './slices/personalSlice.js';

export const store = configureStore({
  reducer: { room, personal },
});
