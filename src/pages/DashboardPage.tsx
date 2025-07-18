'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  FolderKanban,
  CheckCircle,
  Mail,
  FileText,
  PlusCircle,
  Clock,
} from 'lucide-react';

interface DashboardStats {
  projects: number;
  tasksCompleted: number;
  unreadMessages: number;
  pendingInvoices: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    tasksCompleted: 0,
    unreadMessages: 0,
    pendingInvoices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const projectsSnap = await getDocs(
          query(collection(db, 'projects'), where('ownerId', '==', user.uid))
        );

        const tasksSnap = await getDocs(
          query(collection(db, 'tasks'), where('assignedTo', '==', user.uid))
        );

        const messagesSnap = await getDocs(
          query(collection(db, 'messages'), where('receiverId', '==', user.uid))
        );

        const invoicesSnap = await getDocs(
          query(collection(db, 'invoices'), where('userId', '==', user.uid))
        );

        setStats({
          projects: projectsSnap.size,
          tasksCompleted: tasksSnap.docs.filter((t) => t.data().status === 'done').length,
          unreadMessages: messagesSnap.docs.filter((m) => !m.data().read).length,
          pendingInvoices: invoicesSnap.docs.filter((i) => i.data().status === 'pending').length,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome back 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Projects" icon={<FolderKanban className="text-blue-600" />} count={stats.projects} />
        <Card title="Tasks Completed" icon={<CheckCircle className="text-green-600" />} count={stats.tasksCompleted} />
        <Card title="Unread Messages" icon={<Mail className="text-purple-600" />} count={stats.unreadMessages} />
        <Card title="Pending Invoices" icon={<FileText className="text-red-600" />} count={stats.pendingInvoices} />
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button className="text-sm text-blue-500 hover:underline">View Timeline</button>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 text-gray-400" />
            Completed task “Finish Dashboard UI”
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 text-gray-400" />
            Sent invoice to client “Acme Co.”
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 text-gray-400" />
            Created project “Landing Page Redesign”
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
          <PlusCircle size={16} /> New Task
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
          <PlusCircle size={16} /> New Project
        </button>
      </div>
    </div>
  );
};

const Card = ({
  title,
  icon,
  count,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
}) => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex items-center gap-4">
    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-2xl font-semibold">{count}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </div>
);

export default DashboardPage;
