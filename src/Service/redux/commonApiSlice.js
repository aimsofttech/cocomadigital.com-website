import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminServiceInstance from "../apiService";

// Async thunk for fetching common API data
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
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommonApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommonApi.fulfilled, (state, action) => {
                state.loading = false;
                state.commonApi = action.payload;
            })
            .addCase(fetchCommonApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default commonApiSlice.reducer;
