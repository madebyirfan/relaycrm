// src/components/NotificationDropdown.tsx
import { Dropdown, Menu } from 'antd';
import useAppSelector from '../hooks/useAppSelector';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const notifications = useAppSelector((state) => state.notifications.items);

  const menu = (
    <Menu className="dark:bg-[#2a2a2a] dark:text-white w-72">
      {notifications.slice(0, 5).map((n) => (
        <Menu.Item key={n.id}>
          <div className="truncate">
            <strong>{n.title}</strong>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.body}</p>
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item>
        <Link to="/notifications">View All</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Bell className="cursor-pointer text-gray-700 dark:text-white" />
    </Dropdown>
  );
};

export default NotificationDropdown;