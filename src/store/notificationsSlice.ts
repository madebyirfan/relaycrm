import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Notification } from '../types/Notification';

interface NotificationState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<Notification[]>(
  'notifications/fetchNotifications',
  async () => {
    const res = await fetch(
      'https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/notifications'
    );
    const data = await res.json();

    if (!data.documents) return [];

    return data.documents.map((doc: any) => ({
      id: doc.name.split('/').pop(),
      title: doc.fields.title.stringValue,
      body: doc.fields.body.stringValue,
    }));
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch notifications';
      });
  },
});

export default notificationsSlice.reducer;
