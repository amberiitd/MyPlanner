import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sprint } from "../../model/types";
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
    value: {
        fields: Field[];
    };
    loaded: boolean;
} = {
    value: {
        fields: fields
    },
    loaded: false,
}
const userPrefSlice = createSlice({
    name: 'userPref',
    initialState, 
    reducers: {
        updateFields: (state, action: PayloadAction<{id: string, data: {fieldCardId: "details" | "pinned"}}> ) =>{
            const index = state.value.fields.findIndex(field => field.value === action.payload.id);
            if (index >= 0){
                state.value.fields[index] = {...state.value.fields[index], ...action.payload.data }
            }
        }
    }
})

export const updateFields = userPrefSlice.actions.updateFields;

export const userPrefReducers = userPrefSlice.reducer;