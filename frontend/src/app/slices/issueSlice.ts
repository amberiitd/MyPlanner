import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniq } from "lodash";
import { IssueComment } from "../../model/types";
import { Issue } from "../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon";
import { distinct } from "../../util/method";


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
            state.values = distinct(state.values.concat(action.payload), (obj: Issue)=> obj.id);
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
        addComment: (state, action: PayloadAction<{id: string; data: IssueComment}>) => {
            const issue = state.values.find(iss => iss.id === action.payload.id);
            if (issue){
                if (issue.comments){
                    issue.comments.push(action.payload.data);
                }else{
                    issue.comments = [action.payload.data]
                }
            }
        },
        updateComment: (state, action: PayloadAction<{id: string; data: {currentIndex: number; updateData: any}}>) => {
            const issue = state.values.find(iss => iss.id === action.payload.id);
            if (issue && issue.comments){
                issue.comments.splice(action.payload.data.currentIndex, 1, {...issue.comments[action.payload.data.currentIndex], ...action.payload.data.updateData});
            }
        },
        deleteComment: (state, action: PayloadAction<{id: string; data: {currentIndex: number;}}>) => {
            const issue = state.values.find(iss => iss.id === action.payload.id);
            if (issue && issue.comments){
                issue.comments.splice(action.payload.data.currentIndex, 1);
            }
        }
    }
})

export const addIssue = issueSlice.actions.add;
export const removeIssue = issueSlice.actions.remove;
export const addIssueBulk = issueSlice.actions.addBulk;
export const refreshIssue = issueSlice.actions.resfresh;
export const updateIssue = issueSlice.actions.update;
export const updateIssueBulk = issueSlice.actions.updateBulk;
export const addIssueComment = issueSlice.actions.addComment;
export const updateIssueComment = issueSlice.actions.updateComment;
export const deleteIssueComment = issueSlice.actions.deleteComment;

export const issueReducer = issueSlice.reducer;