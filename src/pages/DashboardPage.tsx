// File: src/pages/DashboardPage.tsx
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const handleSuccess = () => toast.success('Dashboard Loaded');
  const handleError = () => toast.error('Something went wrong');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-4">Welcome to Multi Project Dashboard</h1>
      <div className="flex gap-4">
        <button
          onClick={handleSuccess}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Show Success
        </button>
        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Show Error
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardPage;