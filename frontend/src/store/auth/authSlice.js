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
  bio: null,
  role :null,
  coin:0
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action) {
      const { id, username, name, email, picture, gender, birthday, bio,role } = action.payload;
      state.id = id;
      state.username = username;
      state.name = name;
      state.email = email;
      state.picture = picture;
      state.gender = gender;
      state.birthday = birthday;
      state.isLoggedIn = true;
      state.bio = bio;
      state.role = role;
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
      state.role = null;
    },
    updateUser(state, action) {
      const { field, value } = action.payload;
      if (field === 'name') {
        state.name = value;
      } else if (field === 'username') {
        state.username = value;
      } else if (field === 'picture') {
        state.picture = value;
      } else if (field === 'bio') {
        state.bio = value;
      }
    },
    resetAuth(state) {
      Object.keys(state).forEach(key => {
        state[key] = initialState[key];
      });
    },
    updateCoins(state,action){
      state.coin = action.payload.coin
    }
  }
});

export const { loginUser, logoutUser, updateUser, resetAuth,updateCoins } = authSlice.actions;
export default authSlice.reducer;
