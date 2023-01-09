import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../model/types";

const initialState: {
    values: User[];
    loaded: boolean;
} = {
    values: [],
    loaded: false,
}
const userSlice = createSlice({
    name: 'users',
    initialState, 
    reducers: {
        refresh: (state, action: PayloadAction<User[]> ) => {
            state.values = action.payload;
            state.loaded = true;
        },
    }
})

export const refreshUser = userSlice.actions.refresh;

export const userReducers = userSlice.reducer;