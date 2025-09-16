import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showTutorial: true,
  searchTutorial: false,
  offerTutorial: false,
  infoTutorial: false,
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    setSearchTutorial: (state, action) => {
      state.searchTutorial = action.payload;
    },
    setOfferTutorial: (state, action) => {
      state.offerTutorial = action.payload;
    },
    setInfoTutorial: (state, action) => {
      state.infoTutorial = action.payload;
    },
    setShowTutorial: (state, action) => {
      state.showTutorial = action.payload;
    },
  },
});

export const { setSearchTutorial, setOfferTutorial, setInfoTutorial, setShowTutorial } =
  tutorialSlice.actions;

export default tutorialSlice.reducer;
