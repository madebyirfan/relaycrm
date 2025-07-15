import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import searchReducer from './searchSlice';

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  search: searchReducer,
});

// Optional: define state type to match reducer structure
export type RootState = ReturnType<typeof rootReducer>;

const loadFromLocalStorage = (): Partial<RootState> | undefined => {
  try {
    const serialized = localStorage.getItem('reduxState');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadFromLocalStorage(),
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(
      'reduxState',
      JSON.stringify({
        theme: state.theme,
        auth: state.auth,
        search: state.search,
      })
    );
  } catch (e) {
    console.warn('Redux localStorage save failed:', e);
  }
});

export type AppDispatch = typeof store.dispatch;
export default store;
