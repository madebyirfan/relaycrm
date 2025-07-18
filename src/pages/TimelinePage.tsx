'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Clock } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

const TimelinePage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Activity, 'id'>)
      }));
      setActivities(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Activity Timeline</h2>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No activities yet.</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="pt-1">
                <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1 border-l pl-4 border-gray-300 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{activity.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{activity.description}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp.seconds * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
