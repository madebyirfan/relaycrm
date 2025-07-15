import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  query: string;
}

export const initialSearchState: SearchState = {
  query: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearchQuery: (state) => {
      state.query = '';
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
