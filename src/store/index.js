import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import jobReducer from "./slices/jobSlice"
import firebaseReducer from "./slices/firebaseSlice";


export const store = configureStore({
    reducer: {
        user: userReducer,
        jobs: jobReducer,
        firebase: firebaseReducer,
    }
});

