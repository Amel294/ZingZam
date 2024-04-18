import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  id: null,
  username: null,
  name: null,
  email: null,
  picture: null,
  gender: null,
  birthday: null,
  bio: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action) {
      const { id, username, name, email, picture, gender, birthday, bio } = action.payload;
      state.id = id;
      state.username = username;
      state.name = name;
      state.email = email;
      state.picture = picture;
      state.gender = gender;
      state.birthday = birthday;
      state.isLoggedIn = true;
      state.bio = bio;
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
      state.bio = null;
    },
    updateUser(state, action) {
      const { field, value } = action.payload;
      if (field === 'name') {
        state.name = value;
      } else if (field === 'username') {
        state.username = value;
      } else if (field === 'picture') {
        state.picture = value;
      }
    },
    resetAuth(state) {
      Object.keys(state).forEach(key => {
        state[key] = initialState[key];
      });
    }
  }
});

export const { loginUser, logoutUser, updateUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
