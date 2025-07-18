'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // make sure your Firebase config exports `db`
import { Loader2 } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    clients: 0,
    invoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, clientsSnap, invoicesSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'clients')),
          getDocs(collection(db, 'invoices')),
        ]);

        setStats({
          users: usersSnap.size,
          clients: clientsSnap.size,
          invoices: invoicesSnap.size,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600 dark:text-gray-300" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Clients" value={stats.clients} />
          <StatCard title="Total Invoices" value={stats.invoices} />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AdminDashboardPage;
