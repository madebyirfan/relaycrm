import themeReducer, { toggleTheme, setTheme } from '../store/themeSlice';

describe('themeSlice', () => {
  it('should toggle between dark and light', () => {
    expect(themeReducer({ value: 'light' }, toggleTheme())).toEqual({ value: 'dark' });
    expect(themeReducer({ value: 'dark' }, toggleTheme())).toEqual({ value: 'light' });
  });

  it('should set specific theme', () => {
    expect(themeReducer({ value: 'light' }, setTheme('dark'))).toEqual({ value: 'dark' });
  });
});
