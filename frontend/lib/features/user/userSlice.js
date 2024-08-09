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
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
