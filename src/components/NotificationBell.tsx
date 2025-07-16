// src/components/NotificationBell.tsx
import { Bell } from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { fetchNotifications } from '../store/notificationsSlice';

const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <Link to="/notifications" className="relative">
      <Badge count={notifications.length} size="small">
        <Bell className="text-gray-700 dark:text-white cursor-pointer" />
      </Badge>
    </Link>
  );
};

export default NotificationBell;