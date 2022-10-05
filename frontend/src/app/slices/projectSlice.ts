
import { createSlice } from '@reduxjs/toolkit'
import { Project } from '../../model/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { stat } from 'fs';

const initialState:  {
    values: Project[];
}= {
    values: []
};

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Project> ) =>{
            state.values.push(action.payload);
        },
        remove: (state, action: PayloadAction<{key: string;}>) =>{
            const index = state.values.findIndex(p => p.key === action.payload.key);
            if (index >= 0){
                state.values.splice(index, 1);
            }
        },
        addBulk: (state, action: PayloadAction<Project[]> ) =>{
            state.values = state.values.concat(action.payload);
        },
        resfresh: (state, action: PayloadAction<Project[]> ) =>{
            state.values = action.payload;
        },
    }
})

export const addProject = projectSlice.actions.add;
export const removeProject = projectSlice.actions.remove;
export const addProjectBulk = projectSlice.actions.addBulk;
export const refreshProject = projectSlice.actions.resfresh;

export const projectReducer = projectSlice.reducer;
