// src/pages/NotificationsPage.tsx
import { useEffect } from 'react';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { fetchNotifications } from '../store/notificationsSlice';

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <ul className="space-y-4">
        {items.map((notif) => (
          <li
            key={notif.id}
            className="p-4 rounded bg-white dark:bg-[#2a2a2a] shadow hover:bg-gray-100 dark:hover:bg-[#333]"
          >
            <p className="text-lg font-medium">{notif.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{notif.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
