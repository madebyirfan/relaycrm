// Complete & Updated: src/layouts/DashboardLayout.tsx
import {
    Layout,
    Input,
    Dropdown,
    Menu,
    Button,
    Breadcrumb,
    Badge,
} from 'antd';
import { useEffect, useState } from 'react';
import {
    Menu as LucideMenu,
    Sun,
    Moon,
    Search,
    Settings,
    LayoutDashboard,
    LogOut,
    User,
    Bell,
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import type { RootState } from '../store';
import clsx from 'clsx';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { setSearchQuery } from '../store/searchSlice';
import { auth } from '../firebase/config';
import 'react-toastify/dist/ReactToastify.css';
import PageLoadingBar from '../components/PageLoadingBar';
import useAppSelector from '../hooks/useAppSelector';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const theme = useSelector((state: RootState) => state.theme.value);
    const query = useSelector((state: RootState) => state.search.query);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const userRole = useAppSelector((state) => state.auth.role);
    const breadcrumbs = location.pathname.split('/').filter(Boolean);

    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        if (screenWidth < 768) setCollapsed(true);
        return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);

    useEffect(() => {
        dispatch(setSearchQuery(''));
    }, [location.pathname, dispatch]);

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }
        const allData = ['Dashboard', 'Settings', 'Profile', 'Logout', 'Users', 'Roles'];
        const filtered = allData.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setShowSuggestions(true);
    }, [query]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const userMenu = (
        <Menu
            className="dark:bg-[#2a2a2a] dark:text-white shadow-lg"
            items={[
                {
                    key: 'profile',
                    label: <span className="text-gray-800 dark:text-gray-100">Profile</span>,
                    icon: <User size={16} />,
                },
                {
                    key: 'logout',
                    label: (
                        <span onClick={handleLogout} className="text-red-500 hover:text-red-600">
                            Logout
                        </span>
                    ),
                    icon: <LogOut size={16} />,
                },
            ]}
        />
    );

    const notifications = [
        { id: 1, message: 'New update available' },
        { id: 2, message: 'System maintenance at 2AM' },
    ];

    const NotificationDropdown = (
        <Menu
            items={notifications.map((n) => ({
                key: n.id,
                label: <span>{n.message}</span>,
            }))}
        />
    );

    return (
        <Layout className={clsx('min-h-screen transition-all', theme === 'dark' && 'dark')}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="bg-white dark:bg-[#1f1f1f] shadow-lg"
                breakpoint="md"
                onBreakpoint={(broken) => setCollapsed(broken)}
            >
                <div className="text-center text-xl font-bold text-gray-800 dark:text-white p-4">
                    {collapsed ? 'MP' : 'Multi Project'}
                </div>
                <Menu
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    className="dark:bg-[#1f1f1f]"
                >
                    <Menu.Item
                        key="/"
                        icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/">Dashboard</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="/profile"
                        icon={<User size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="/projects"
                        icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/projects">Projects</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="/tasks"
                        icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/tasks">Tasks</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="/invoices"
                        icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/invoices">Invoices</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="/chat"
                        icon={<Bell size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/chat">Chat</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="/timeline"
                        icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                    >
                        <Link to="/timeline">Timeline</Link>
                    </Menu.Item>

                    {userRole === 'admin' && (
                        <>
                            <Menu.Item
                                key="/admin/clients"
                                icon={<User size={18} className="text-gray-700 dark:text-white" />}
                            >
                                <Link to="/admin/clients">Clients</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="/admin/projects"
                                icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                            >
                                <Link to="/admin/projects">Assign Projects</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="/admin/dashboard"
                                icon={<LayoutDashboard size={18} className="text-gray-700 dark:text-white" />}
                            >
                                <Link to="/admin/dashboard">Analytics</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="/admin/roles"
                                icon={<Settings size={18} className="text-gray-700 dark:text-white" />}
                            >
                                <Link to="/admin/roles">Manage Roles</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="/settings"
                                icon={<Settings size={18} className="text-gray-700 dark:text-white" />}
                            >
                                <Link to="/settings">Settings</Link>
                            </Menu.Item>
                        </>
                    )}
                </Menu>
            </Sider>
            <PageLoadingBar />
            <Layout>
                <Header className="flex justify-between items-center px-4 bg-white dark:bg-[#141414] shadow">
                    <div className="flex items-center gap-3">
                        <Button
                            type="text"
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-gray-700 dark:text-white"
                        >
                            <LucideMenu size={20} />
                        </Button>
                        <div className="relative w-64">
                            <Input
                                prefix={<Search size={16} className="text-gray-500 dark:text-gray-400" />}
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                className="dark:bg-[#333] dark:text-white"
                                style={{
                                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                                    color: theme === 'dark' ? '#fff' : '#000',
                                }}
                                onFocus={() => query && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            />
                            {showSuggestions && (
                                <motion.ul
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute z-50 mt-1 w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-600 rounded shadow"
                                >
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item, idx) => (
                                            <li
                                                key={idx}
                                                onMouseDown={() => {
                                                    navigate('/search');
                                                    setShowSuggestions(false);
                                                }}
                                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-700 dark:text-white cursor-pointer"
                                            >
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-gray-400 dark:text-gray-500">
                                            No results found
                                        </li>
                                    )}
                                </motion.ul>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dropdown overlay={NotificationDropdown} trigger={['click']}>
                            <Badge count={notifications.length} size="small">
                                <Bell className="text-gray-700 dark:text-white cursor-pointer" size={20} />
                            </Badge>
                        </Dropdown>
                        <LanguageSwitcher />
                        <Button
                            type="text"
                            onClick={() => dispatch(toggleTheme())}
                            className="text-gray-700 dark:text-yellow-300"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </Button>
                        <Dropdown
                            overlay={userMenu}
                            trigger={['click']}
                            open={dropdownOpen}
                            onOpenChange={(open) => setDropdownOpen(open)}
                        >
                            <motion.img
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                src="https://i.pravatar.cc/40"
                                alt="avatar"
                                className="rounded-full w-8 h-8 cursor-pointer ring-2 ring-blue-500 dark:ring-blue-400"
                            />
                        </Dropdown>
                    </div>
                </Header>

                <Content className="p-6 bg-gray-50 dark:bg-[#1a1a1a] text-black dark:text-white">
                    <Breadcrumb className="mb-4 text-gray-700 dark:text-gray-200">
                        <Breadcrumb.Item>
                            <Link
                                to="/"
                                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Home
                            </Link>
                        </Breadcrumb.Item>
                        {breadcrumbs.map((crumb, index) => (
                            <Breadcrumb.Item key={index}>
                                <span className="text-gray-700 dark:text-gray-200 capitalize">{crumb}</span>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Outlet />
                    </motion.div>
                </Content>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;