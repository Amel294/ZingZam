import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  id: null,
  username: null,
  name: null,
  email: null,
  picture: null,
  role: null
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    loginAdmin(state, action) {
      const { id, username, name, email, picture, role } = action.payload;
      state.id = id;
      state.username = username;
      state.name = name;
      state.email = email;
      state.picture = picture;
      state.isLoggedIn = true;
      state.role = role;
    },
    logoutAdmin(state) {
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
    resetAdminAuth(state) {
      Object.keys(state).forEach(key => {
        state[key] = initialState[key];
      });
    }
  }
});

export const { loginAdmin, logoutAdmin,  resetAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
