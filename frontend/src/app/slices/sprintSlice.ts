import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sprint } from "../../model/types";


const initialState: {
    values: Sprint[];
    loaded: boolean;
} = {
    values: [],
    loaded: false,
}
const sprintSlice = createSlice({
    name: 'sprints',
    initialState, 
    reducers: {
        add: (state, action: PayloadAction<Sprint> ) =>{
            state.values.push(action.payload);
        },
        remove: (state, action: PayloadAction<{id: string;}>) =>{
            const index = state.values.findIndex(s => s.id === action.payload.id);
            if (index >= 0){
                state.values.splice(index, 1);
            }
        },
        addBulk: (state, action: PayloadAction<Sprint[]> ) =>{
            state.values = state.values.concat(action.payload);
        },
        resfresh: (state, action: PayloadAction<Sprint[]> ) =>{
            state.values = action.payload;
            state.loaded = true;
        },
        update: (state, action: PayloadAction<{id: string; data: any}>) =>{
            const index = state.values.findIndex(iss => iss.id === action.payload.id);
            if (index >= 0){
                state.values.splice(index, 1, {...state.values[index], ...action.payload.data});
            }
        },
    }
})

export const addSprint = sprintSlice.actions.add;
export const removeSprint = sprintSlice.actions.remove;
export const addSprintBulk = sprintSlice.actions.addBulk;
export const refreshSprint = sprintSlice.actions.resfresh;
export const updateSprint = sprintSlice.actions.update;

export const sprintReducers = sprintSlice.reducer;