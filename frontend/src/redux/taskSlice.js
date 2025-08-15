import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// ✅ Fetch tasks with optional filters
export const fetchTasks = createAsyncThunk(
  'tasks/fetch',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/tasks', { params: filters });
      return res.data;
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload || 'Failed to fetch tasks';
      });
  }
});

export default taskSlice.reducer;
