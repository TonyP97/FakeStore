import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    token: null,
    userID: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserID: (state, action) => {
      state.userID = action.payload;
    }
  },
});

export const {
  setToken,
  setUserID
} = loginSlice.actions;

export default loginSlice.reducer;
