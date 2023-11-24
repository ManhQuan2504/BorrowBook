import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  language: 'vi', // Mặc định là tiếng Việt

};

export const borrowBookSlice = createSlice({
  name: "borrowBook",
  initialState,
  reducers: {
    // userInfo
    detailUser: (state, action) => {
      state.userInfo[0] = action.payload;

    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {
  detailUser,setLanguage
} = borrowBookSlice.actions;
export default borrowBookSlice.reducer;
