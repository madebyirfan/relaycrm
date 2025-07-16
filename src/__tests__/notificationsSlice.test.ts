// src/store/notificationsSlice.test.ts
import reducer, { fetchNotifications } from '../store/notificationsSlice';

describe('notificationsSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      list: [],
      loading: false,
      error: null,
    });
  });

  it('should handle fetchNotifications.pending', () => {
    const state = reducer(undefined, { type: fetchNotifications.pending.type });
    expect(state.loading).toBe(true);
  });

  it('should handle fetchNotifications.fulfilled', () => {
    const payload = [{ id: '1', message: 'Test', time: '123' }];
    const state = reducer(undefined, { type: fetchNotifications.fulfilled.type, payload });
    expect(state.items).toEqual(payload);
  });

  it('should handle fetchNotifications.rejected', () => {
    const state = reducer(undefined, {
      type: fetchNotifications.rejected.type,
      error: { message: 'Error' },
    });
    expect(state.error).toBe('Error');
  });
});
