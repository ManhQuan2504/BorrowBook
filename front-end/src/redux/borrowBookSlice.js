import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  
  view: {},
};

export const borrowBookSlice = createSlice({
  name: "borrowBook",
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
} = borrowBookSlice.actions;
export default borrowBookSlice.reducer;
