import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  
  view: {},
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
  

    // View
    setView: (state, action) => {
      state.view = action.payload;
    },

    // userInfo
    detailUser: (state, action) => {
      state.userInfo[0] = action.payload;
    
    },

  },
});

export const {
 
  setView,
  detailUser,
} = orebiSlice.actions;
export default orebiSlice.reducer;
