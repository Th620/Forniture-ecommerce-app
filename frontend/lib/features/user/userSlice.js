import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo:
    localStorage.getItem("account") &&
    JSON.parse(localStorage.getItem("account")).expiresAt > Date.now()
      ? JSON.parse(localStorage.getItem("account")).data
      : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    resetUserInfo: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("account");
    },
  },
});

export const { setUserInfo, resetUserInfo } = userSlice.actions;
export default userSlice.reducer;
