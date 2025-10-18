import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminServiceInstance from "../apiService";

// Async thunk for fetching service data
export const fetchServices = createAsyncThunk(
    "service/fetchServices",
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminServiceInstance?.Services(params);
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const serviceSlice = createSlice({
    name: "service",
    initialState: {
        services: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default serviceSlice.reducer;
