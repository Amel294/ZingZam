import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],             // Array to hold all posts
    isLoading: false,      // Flag for loading state
    error: null,           // To store any errors
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        fetchPostsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchPostsSuccess(state, action) {
            state.posts = [...state.posts, ...action.payload];
            state.isLoading = false;
            state.error = null;
        },        
        fetchPostsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        addPost(state, action) {
            state.posts.push(action.payload);
        },
        updatePost(state, action) {
            const postIndex = state.posts.findIndex(post => post.id === action.payload.id);
            if (postIndex !== -1) {
                state.posts[postIndex] = action.payload;
            }
        },
        deletePost(state, action) {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        },
        clearPosts(state) {
            state.posts = [];
            state.isLoading = false;
            state.error = null;
        }
    },
});

export const {
    fetchPostsStart,
    fetchPostsSuccess,
    fetchPostsFailure,
    addPost,
    updatePost,
    deletePost,
    clearPosts
} = postsSlice.actions;

export default postsSlice.reducer;
