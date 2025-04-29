import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobs: [],
};

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        addJob: (state, action) => {
            state.jobs.push(action.payload);
        },
        setJobs: (state, action) => {
            state.jobs = action.payload;
        },
        deleteJob: (state, action) => {
            state.jobs = state.jobs.filter((job) => job.id !== action.payload);
        },
        editJob: (state, action) => {
            const { id, updatedJob } = action.payload;
            const index = state.jobs.findIndex((job) => job.id === id);
            if (index !== -1) {
                state.jobs[index] = { ...state.jobs[index], ...updatedJob };
            }
        },
    },
});

export const { addJob, setJobs, deleteJob, editJob } = jobSlice.actions;
export default jobSlice.reducer;
