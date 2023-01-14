import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationProps{
    show: boolean;
    text?: string;
    id?: string;
    render?: () => JSX.Element;
}

const initialState: {
    notification: NotificationProps;
} = {
    notification: {
        show: false,
    }
}
const globalStateSlice = createSlice({
    name: 'globalState',
    initialState,
    reducers: {
        pushNotification: (state, action: PayloadAction<NotificationProps> ) =>{
            state.notification = action.payload;
        },
    }
})

export const pushNotification = globalStateSlice.actions.pushNotification;
export const globalStateReducer = globalStateSlice.reducer;