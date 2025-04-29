import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    email: null,
    token: null,
    id: null,
    notifications: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.id = action.payload.id;
        },
        removeUser(state) {
            state.email = null;
            state.token = null;
            state.id = null;
        },
        setNotifications(state, action) {
            state.notifications = action.payload;
        },
    },
})

export const { setUser, removeUser, setNotifications } = userSlice.actions;

export default userSlice.reducer;