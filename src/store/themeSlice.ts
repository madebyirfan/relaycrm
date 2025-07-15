import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  value: ThemeMode;
}

export const initialThemeState: ThemeState = {
  value: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: initialThemeState,
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.value = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
