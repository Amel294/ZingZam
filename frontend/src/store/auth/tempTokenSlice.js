import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tempToken: null
};

const tempTokenSlice = createSlice({
    name: 'tempToken',
    initialState,
    reducers: {
        addTempToken(state, action) {
            state.tempToken = action.payload;
        },
        resetTempToken(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key];
            });
        }
    },
});

export const { addTempToken,resetTempToken } = tempTokenSlice.actions;
export default tempTokenSlice.reducer;