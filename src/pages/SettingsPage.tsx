// File: src/pages/SettingsPage.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import { db } from '../firebase/config'; // adjust based on your project
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  Timestamp,
} from 'firebase/firestore';

type Activity = {
  id: string;
  message: string;
  performedBy: string;
  timestamp: Timestamp;
};

const SettingsPage = () => {
  const role = useUserRole();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const q = query(
          collection(db, 'activities'),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const data: Activity[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Activity, 'id'>),
        }));
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'admin') {
      fetchActivities();
    }
  }, [role]);

  if (role === null) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings (Admin Only)</h1>

      {/* 🔐 Admin Activity Logs */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        {loading ? (
          <p className="text-gray-500">Loading activities...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-400">No recent activities found.</p>
        ) : (
          <ul className="space-y-3 max-h-[400px] overflow-y-auto">
            {activities.map(activity => (
              <li key={activity.id} className="border-b pb-2">
                <p className="text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">
                  By: <span className="font-medium">{activity.performedBy}</span>{' '}
                  on{' '}
                  {new Date(activity.timestamp.seconds * 1000).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
