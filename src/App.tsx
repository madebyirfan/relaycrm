import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          {/* Protected Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
