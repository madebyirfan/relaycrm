import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import RequireRole from './components/RequireRole';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotificationsPage from './pages/NotificationsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import InvoicesPage from './pages/InvoicesPage';
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import AdminClientsPage from './pages/AdminClientsPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRolesPage from './pages/AdminRolesPage';
import './config/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './config/i18n';
import Startup from './components/Startup';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Router>
          <Startup /> {/* ✅ Moved outside of <Routes> */}
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Public Routes */}
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
              {/* Accessible to all authenticated users */}
              <Route index element={<DashboardPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />

              {/* Admin-only Routes */}
              <Route
                path="settings"
                element={
                  <RequireRole role="admin">
                    <SettingsPage />
                  </RequireRole>
                }
              />
              <Route
                path="admin/clients"
                element={
                  <RequireRole role="admin">
                    <AdminClientsPage />
                  </RequireRole>
                }
              />
              <Route
                path="admin/projects"
                element={
                  <RequireRole role="admin">
                    <AdminProjectsPage />
                  </RequireRole>
                }
              />
              <Route
                path="admin/dashboard"
                element={
                  <RequireRole role="admin">
                    <AdminDashboardPage />
                  </RequireRole>
                }
              />
              <Route
                path="admin/roles"
                element={
                  <RequireRole role="admin">
                    <AdminRolesPage />
                  </RequireRole>
                }
              />
            </Route>
          </Routes>
        </Router>
      </I18nextProvider>
    </Provider>
  );
}


export default App;
