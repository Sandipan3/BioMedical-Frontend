import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

const initialState = {
  token: null,
  walletAddress: null,
  user: null, // includes name, walletAddress, role
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ walletAddress, signature }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { walletAddress, signature });
      // backend returns: { status, data: { token, user }, message }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Try again."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.walletAddress = null;
      state.user = null;
      state.loading = false;
      state.error = null;

      //Clear entire persisted store
      localStorage.removeItem("persist:root");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.walletAddress = action.payload.user.walletAddress;
        state.user = action.payload.user; // contains role, name, walletAddress
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

//Selectors
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthRole = (state) => state.auth.user?.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
