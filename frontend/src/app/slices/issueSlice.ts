import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Issue } from "../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon";


const initialState: {
    values: Issue[];
    loaded: boolean;
} = {
    values: [],
    loaded: false,
}
const issueSlice = createSlice({
    name: 'issues',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<Issue> ) =>{
            state.values.push(action.payload);
        },
        remove: (state, action: PayloadAction<{id: string;}>) =>{
            const index = state.values.findIndex(iss => iss.id === action.payload.id);
            if (index >= 0){
                state.values.splice(index, 1);
            }
        },
        addBulk: (state, action: PayloadAction<Issue[]> ) =>{
            state.values = state.values.concat(action.payload);
        },
        resfresh: (state, action: PayloadAction<Issue[]> ) =>{
            state.values = action.payload;
        },
        update: (state, action: PayloadAction<{id: string; data: any}>) =>{
            const index = state.values.findIndex(iss => iss.id === action.payload.id);
            if (index >= 0){
                state.values.splice(index, 1, {...state.values[index], ...action.payload.data});
            }
        },
        updateBulk: (state, action: PayloadAction<{ids: string[]; data: any}>) =>{
            state.values = state.values.map(issue => action.payload.ids.includes(issue.id)? {...issue, ...action.payload.data}: issue);
        },
    }
})

export const addIssue = issueSlice.actions.add;
export const removeIssue = issueSlice.actions.remove;
export const addIssueBulk = issueSlice.actions.addBulk;
export const refreshIssue = issueSlice.actions.resfresh;
export const updateIssue = issueSlice.actions.update;
export const updateIssueBulk = issueSlice.actions.updateBulk;


export const issueReducer = issueSlice.reducer;