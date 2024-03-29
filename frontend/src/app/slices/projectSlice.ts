
import { createSlice } from '@reduxjs/toolkit'
import { Project } from '../../model/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { stat } from 'fs';

const initialState:  {
    values: Project[];
    loaded: boolean;
}= {
    values: [],
    loaded: false
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
        update: (state, action: PayloadAction<{key: string; data: any}>) =>{
            const index = state.values.findIndex(p => p.key === action.payload.key);
            if (index >= 0){
                state.values[index] = {...state.values[index], ...action.payload.data};
            }
        },
        addBulk: (state, action: PayloadAction<Project[]> ) =>{
            state.values = state.values.concat(action.payload);
        },
        resfresh: (state, action: PayloadAction<Project[]> ) =>{
            state.values = action.payload;
            state.loaded = true;
        },
    }
})

export const addProject = projectSlice.actions.add;
export const removeProject = projectSlice.actions.remove;
export const addProjectBulk = projectSlice.actions.addBulk;
export const refreshProject = projectSlice.actions.resfresh;
export const updateProject = projectSlice.actions.update;

export const projectReducer = projectSlice.reducer;
