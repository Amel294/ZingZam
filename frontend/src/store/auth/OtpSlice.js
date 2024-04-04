import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tempToken: null
};

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        addTempToken(state, action) {
            state.tempToken = action.payload;
        },
    },
});

export const { addTempToken } = otpSlice.actions;
export default otpSlice.reducer;