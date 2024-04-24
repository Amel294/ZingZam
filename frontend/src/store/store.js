import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import postsReducers from './auth/postsSlice';
import adminAuthReducer from './auth/adminAuthSlice';
import tempTokenReducer from './auth/tempTokenSlice'
import userPostsReducer from './auth/userPostsSlice'
import loadingReducer from './auth/loadingSlice'
// Define persist configuration
const persistConfig = {
    key: 'root', // key for storage
    storage, // define storage engine
    whitelist: ['auth','adminAuth'], // reducers to persist
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    tempToken: tempTokenReducer,
    posts: postsReducers,
    adminAuth : adminAuthReducer,
    userPosts: userPostsReducer,
    loading : loadingReducer
});

// Apply persist configuration to root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Export persistor if needed
export const persistor = persistStore(store);
