import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userPosts: [],             
    isLoading: false,         
    error: null,             
};

const userPostsSlice = createSlice({
    name: 'userPosts',
    initialState,
    reducers: {
        fetchUserPostsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchUserPostsSuccess(state, action) {
            const newPosts = action.payload.filter(newPost => (
                !state.userPosts.some(existingPost => existingPost._id === newPost._id)
            ));
            state.userPosts = [...state.userPosts, ...newPosts];
            state.isLoading = false;
            state.error = null;
        },
        
        fetchUserPostsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        addUserPost(state, action) {
            state.userPosts.push(action.payload);
        },
        updateUserPost(state, action) {
            const postIndex = state.userPosts.findIndex(post => post.id === action.payload.id);
            if (postIndex !== -1) {
                state.userPosts[postIndex] = action.payload;
            }
        },
        deleteUserPost(state, action) {
            state.userPosts = state.userPosts.filter(post => post.id !== action.payload);
        },
        resetUserPosts(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key];
            });
        }
    },
});

export const {
    fetchUserPostsStart,
    fetchUserPostsSuccess,
    fetchUserPostsFailure,
    addUserPost,
    updateUserPost,
    deleteUserPost,
    resetUserPosts
} = userPostsSlice.actions;

export default userPostsSlice.reducer;
