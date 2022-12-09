
import { configureStore } from '@reduxjs/toolkit'
import { issueReducer } from './slices/issueSlice';
import { projectReducer } from './slices/projectSlice'
import { sprintReducers } from './slices/sprintSlice';
import { userPrefReducers } from './slices/userPrefSlice';

export const store = configureStore({
    reducer: {
        projects: projectReducer,
        sprints: sprintReducers,
        issues: issueReducer,
        userPref: userPrefReducers
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;