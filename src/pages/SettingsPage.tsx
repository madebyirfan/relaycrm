// File: src/pages/SettingsPage.tsx
import { useUserRole } from '../hooks/useUserRole';
import { Navigate } from 'react-router-dom';

const SettingsPage = () => {
  const role = useUserRole();

  if (role === null) return null;
  if (role !== 'admin') return <Navigate to="/" replace />;

  return <h1 className="text-2xl font-bold">Settings (Admin Only)</h1>;
};

export default SettingsPage;