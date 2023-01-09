import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sprint, UserPref } from "../../model/types";
import { Field } from "../../pages/Projects/ProjectBoard/IssueView/SideView/FieldCard/FieldCard";

const fields: Field[] = [
    {
        label: 'Sprint',
        value: 'sprint',
        component: 'sprint',
        fieldCardId: 'details'
    },
    {
        label: 'Story point estimate',
        value: 'story-point',
        component: 'story-point',
        fieldCardId: 'details'
    }
];

const initialState: {
    values: UserPref[];
    loaded: boolean;
} = {
    values: [],
    loaded: false,
}
const userPrefSlice = createSlice({
    name: 'userPrefs',
    initialState, 
    reducers: {
        updateFields: (state, action: PayloadAction<{projectId: string; fieldId: string; data: {fieldCardId: "details" | "pinned"}}> ) =>{
            const prefIndex = state.values.findIndex(pref => pref.projectId === action.payload.projectId);
            const fieldIndex = (state.values[prefIndex].issueFields || []).findIndex(field => field.value === action.payload.fieldId);
            if (fieldIndex >= 0){
                (state.values[prefIndex].issueFields || [])[fieldIndex] = {...(state.values[prefIndex].issueFields || [])[fieldIndex], ...action.payload.data }
            }
        },
        update: (state, action: PayloadAction<{id: string; data: any;}> ) => {
            const index = state.values.findIndex(pref => pref.id === action.payload.id);
            if (index >=0 ){
                state.values[index] = {...state.values[index], ...action.payload.data};
            } else{
                state.values.push({
                    id: action.payload.id,
                    ...action.payload.data
                })
            }
        },
        refresh: (state, action: PayloadAction<UserPref[]> ) => {
            state.values = action.payload;
            state.loaded = true;
        },
    }
})

export const updateFields = userPrefSlice.actions.updateFields;
export const updateUserPref = userPrefSlice.actions.update;
export const refreshUserPref = userPrefSlice.actions.refresh;

export const userPrefReducers = userPrefSlice.reducer;