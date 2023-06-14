import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    token: null,
    userID: null,
    admin: null
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    }
  },
});

export const {
  setToken,
  setUserID,
  setAdmin
} = loginSlice.actions;

export default loginSlice.reducer;
