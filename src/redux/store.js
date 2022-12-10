import { configureStore } from '@reduxjs/toolkit';
import logic from './slices/logicSlice.js';

export const store = configureStore({
  reducer: { logic },
});
