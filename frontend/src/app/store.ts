
import { configureStore } from '@reduxjs/toolkit'
import { globalStateReducer } from './slices/globalStateSlice';
import { issueReducer } from './slices/issueSlice';
import { projectReducer } from './slices/projectSlice'
import { sprintReducers } from './slices/sprintSlice';
import { userPrefReducers } from './slices/userPrefSlice';
import { userReducers } from './slices/userSlice';

export const store = configureStore({
    reducer: {
        projects: projectReducer,
        sprints: sprintReducers,
        issues: issueReducer,
        userPrefs: userPrefReducers,
        users: userReducers,
        globalState: globalStateReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;