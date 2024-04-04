import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn:false,
  id: null,
  username: null,
  name: null,
  email: null,
  picture: null,
  gender: null,
  birthday: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.name = action.payload.username;
      state.email = action.payload.email;
      state.picture = action.payload.picture;
      state.gender = action.payload.gender;
      state.birthday = action.payload.birthday;
      state.isLoggedIn=action.payload.isLoggedIn;
    },
    logoutUser(state) {
      state.id = null;
      state.username = null;
      state.name = null;
      state.email = null;
      state.picture = null;
      state.gender = null;
      state.birthday = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
