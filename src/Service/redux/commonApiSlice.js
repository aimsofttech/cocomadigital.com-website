import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminServiceInstance from "../apiService";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Async thunk for fetching common API data with caching
export const fetchCommonApiWithCache = createAsyncThunk(
    "commonApi/fetchWithCache",
    async (params, { getState, rejectWithValue }) => {
        const state = getState();
        const { commonApi } = state;
        
        // Check if data is cached and still valid
        if (
            commonApi.data && 
            commonApi.lastFetch && 
            (Date.now() - commonApi.lastFetch) < CACHE_DURATION
        ) {
            return commonApi.data; // Return cached data
        }
        
        try {
            const response = await adminServiceInstance.CommonApi(params);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Original async thunk for fetching common API data (keeping for backward compatibility)
export const fetchCommonApi = createAsyncThunk(
    "commonApi/fetch",
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminServiceInstance.CommonApi(params);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const commonApiSlice = createSlice({
    name: "commonApi",
    initialState: {
        commonApi: {},
        loading: false,
        error: null,
        lastFetch: null, // Add timestamp for caching
    },
    reducers: {
        // Clear cache when needed
        clearCache: (state) => {
            state.commonApi = {};
            state.lastFetch = null;
        },
        // Manual cache update
        updateCache: (state, action) => {
            state.commonApi = action.payload;
            state.lastFetch = Date.now();
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle cached fetch
            .addCase(fetchCommonApiWithCache.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommonApiWithCache.fulfilled, (state, action) => {
                state.loading = false;
                state.commonApi = action.payload;
                state.lastFetch = Date.now();
            })
            .addCase(fetchCommonApiWithCache.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle original fetch (for backward compatibility)
            .addCase(fetchCommonApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommonApi.fulfilled, (state, action) => {
                state.loading = false;
                state.commonApi = action.payload;
                state.lastFetch = Date.now(); // Update cache timestamp
            })
            .addCase(fetchCommonApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCache, updateCache } = commonApiSlice.actions;
export default commonApiSlice.reducer;
