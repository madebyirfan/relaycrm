import { render, screen } from '@testing-library/react';
import RequireRole from '../components/RequireRole';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import type { AuthState } from '../store/authSlice';
import type { User } from 'firebase/auth';

const mockStore = configureStore([]);

const renderWithProviders = (authState: AuthState, requiredRole: 'admin' | 'user') => {
    const store = mockStore({
        auth: authState,
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <RequireRole role={requiredRole}>
                    <div>Protected Content</div>
                </RequireRole>
            </MemoryRouter>
        </Provider>
    );
};

describe('RequireRole', () => {
    const mockUser: User = {
        uid: '123',
        email: 'test@example.com',
        emailVerified: false,
        displayName: null,
        phoneNumber: null,
        photoURL: null,
        isAnonymous: false,
        metadata: {} as any,
        providerData: [],
        refreshToken: '',
        providerId: '',
        tenantId: null,
        getIdToken: async () => '',
        getIdTokenResult: async () => ({} as any),
        reload: async () => { },
        toJSON: () => ({}),
        delete: async () => { },
    };

    it('shows spinner when loading', () => {
        renderWithProviders({ user: null, role: null, loading: true }, 'admin');
        expect(screen.getByRole('status')).toBeInTheDocument(); // AntD spinner
    });

    it('redirects to login if user is not authenticated', () => {
        renderWithProviders({ user: null, role: null, loading: false }, 'admin');
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to verify-email if email is not verified', () => {
        renderWithProviders({ user: { ...mockUser, emailVerified: false }, role: 'admin', loading: false }, 'admin');
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to unauthorized if user role does not match', () => {
        renderWithProviders({ user: mockUser as any, role: 'user', loading: false }, 'admin');
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders content if user is authenticated and has correct role', () => {
        renderWithProviders({ user: mockUser as any, role: 'admin', loading: false }, 'admin');
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});
