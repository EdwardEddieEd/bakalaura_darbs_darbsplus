import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, set, get, remove, update, query, orderByChild, startAt, endAt } from 'firebase/database';
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
export const loadFilteredJobsFromFirebase = createAsyncThunk(
    'firebase/loadFilteredJobs',
    async (
        {
            title = '',
            location = '',
            category = '',
            minSalary = '',
            maxSalary = '',
            page = 1,
            limit = 6
        },
        { rejectWithValue }
    ) => {
        try {
            const dbRef = ref(database, 'jobs');
            //query
            const q = query(dbRef, orderByChild('title'), startAt(title), endAt(title + '\uf8ff'));
            const snapshot = await get(q);

            if (!snapshot.exists()) return { jobs: [], totalCount: 0 };

            const filtered = [];
            snapshot.forEach((child) => {
                const job = { id: child.key, ...child.val() };
                //filters
                if (
                    (!location || job.location === location) &&
                    (!category || job.category === category) &&
                    (!minSalary || parseInt(job.salary) >= parseInt(minSalary)) &&
                    (!maxSalary || parseInt(job.salary) <= parseInt(maxSalary))
                ) {
                    filtered.push(job);
                }
            });
            //pagination
            const startIndex = (page - 1) * limit;
            const paginated = filtered.slice(startIndex, startIndex + limit);

            return { jobs: paginated, totalCount: filtered.length };
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
        totalCount: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadFilteredJobsFromFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadFilteredJobsFromFirebase.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(loadFilteredJobsFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //save
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
            //delete
            .addCase(deleteJobFromFirebase.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter(job => job.id !== action.payload);
            })
            .addCase(deleteJobFromFirebase.rejected, (state, action) => {
                state.error = action.payload;
            })
            //edit
            .addCase(editJobInFirebase.fulfilled, (state, action) => {
                state.jobs = state.jobs.map(job =>
                    job.id === action.payload.id ? action.payload.updatedJob : job
                );
            })
            .addCase(editJobInFirebase.rejected, (state, action) => {
                state.error = action.payload;
            })
            //change password
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
