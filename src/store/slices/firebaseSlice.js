import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, set, get, remove, update } from 'firebase/database';
import { database, auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';

// Save Firebase
export const saveJobToFirebase = createAsyncThunk(
    'firebase/saveJob',
    async (job, { rejectWithValue }) => {
        try {
            const dbRef = ref(database, 'jobs/' + job.id);
            await set(dbRef, job);
            return job;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Get Firebase
export const loadJobsFromFirebase = createAsyncThunk(
    'firebase/loadJobs',
    async (_, { rejectWithValue }) => {
        try {
            const dbRef = ref(database, 'jobs');
            const snapshot = await get(dbRef);
            if (!snapshot.exists()) {
                return [];
            }
            const jobs = [];
            snapshot.forEach((childSnapshot) => {
                jobs.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            return jobs;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete Firebase
export const deleteJobFromFirebase = createAsyncThunk(
    'firebase/deleteJob',
    async (jobId, { rejectWithValue }) => {
        try {
            const jobRef = ref(database, `jobs/${jobId}`);
            await remove(jobRef);
            return jobId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Edit Firebase
export const editJobInFirebase = createAsyncThunk(
    'firebase/editJob',
    async ({ id, updatedJob }, { rejectWithValue }) => {
        try {
            const jobRef = ref(database, `jobs/${id}`);
            await update(jobRef, updatedJob);
            return { id, updatedJob };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
// password change
export const changeUserPassword = createAsyncThunk(
    'firebase/changeUserPassword',
    async (newPassword, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not logged");

            await updatePassword(user, newPassword);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const firebaseSlice = createSlice({
    name: 'firebase',
    initialState: {
        jobs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadJobsFromFirebase.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadJobsFromFirebase.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(loadJobsFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(saveJobToFirebase.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveJobToFirebase.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs.push(action.payload);
            })
            .addCase(saveJobToFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteJobFromFirebase.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter(job => job.id !== action.payload);
            })
            .addCase(deleteJobFromFirebase.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(editJobInFirebase.fulfilled, (state, action) => {
                state.jobs = state.jobs.map(job =>
                    job.id === action.payload.id ? action.payload.updatedJob : job
                );
            })
            .addCase(editJobInFirebase.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(changeUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeUserPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default firebaseSlice.reducer;
