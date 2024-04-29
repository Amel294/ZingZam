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
            const uniquePosts = action.payload.filter(newPost => 
                !state.posts.some(existingPost => existingPost._id === newPost._id)
            );
            state.posts = [...state.posts, ...uniquePosts];
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
        },
        resetPost(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key];
            });
        },
        updateLikeCountAndUserLiked(state, action) {
            const { postId, likeCount,userLiked } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex].likeCount = likeCount;
                state.posts[postIndex].userLiked = userLiked;
            }
        },
        updateLatestComments(state, action) {
            const { postId, latestComments, commentCount } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex].latestComments = latestComments;
                state.posts[postIndex].commentCount = commentCount;
            }
        },
        updateCaption(state,action){
            const { postId, caption } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex].caption = caption;
            }
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
    clearPosts,
    resetPost,
    updateLikeCountAndUserLiked,
    updateLatestComments,
    updateCaption
} = postsSlice.actions;

export default postsSlice.reducer;
