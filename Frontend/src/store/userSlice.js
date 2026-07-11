// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile } from '../feature/auth/auth.api';

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const data = await getProfile();
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: true,
    error: null
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {    // ← ADD THIS
      state.loading = action.payload;   // ← ADD THIS
    }                                   // ← ADD THIS
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  }
});

export const { clearUser, setUser, setLoading } = userSlice.actions;  // ← ADD setLoading HERE
export default userSlice.reducer;