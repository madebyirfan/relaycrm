// File: src/__tests__/Login.test.tsx
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

test('renders login heading', () => {
  render(<LoginPage />);
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});