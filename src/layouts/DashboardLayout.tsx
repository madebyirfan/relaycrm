// File: src/layouts/DashboardLayout.tsx
import { Layout, Input, Dropdown, Menu, Button, Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import {
    Menu as LucideMenu,
    Sun,
    Moon,
    Search,
    Settings,
    LayoutDashboard,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import type { RootState } from '../store';
import clsx from 'clsx';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { setSearchQuery } from '../store/searchSlice';
import 'react-toastify/dist/ReactToastify.css';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const theme = useSelector((state: RootState) => state.theme.value);
    const dispatch = useDispatch();
    const location = useLocation();
    const query = useSelector((state: RootState) => state.search.query);

    const userRole = 'admin'; // this should ideally come from auth state

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">Profile</Menu.Item>
            <Menu.Item key="logout">Logout</Menu.Item>
        </Menu>
    );

    const breadcrumbs = location.pathname.split('/').filter(Boolean);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        if (screenWidth < 768) setCollapsed(true);
        return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);

    useEffect(() => {
        dispatch(setSearchQuery(''));
    }, [location.pathname]);


    return (
        <Layout className={clsx('min-h-screen transition-all', theme === 'dark' ? 'dark' : '')}>
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
                >
                    <Menu.Item key="/" icon={<LayoutDashboard size={18} />}> <Link to="/">Dashboard</Link> </Menu.Item>
                    {userRole === 'admin' && (
                        <Menu.Item key="/settings" icon={<Settings size={18} />}>
                            <Link to="/settings">Settings</Link>
                        </Menu.Item>
                    )}
                </Menu>
            </Sider>

            <Layout>
                <Header className="flex justify-between items-center px-4 bg-white dark:bg-[#141414] shadow">
                    <div className="flex items-center gap-3">
                        <Button
                            type="text"
                            icon={<LucideMenu size={20} />}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <Input
                            prefix={<Search size={16} />}
                            placeholder="Search..."
                            className="w-64 dark:bg-[#333] dark:text-white"
                            aria-label="Search"
                            value={query}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Button
                            type="text"
                            icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            onClick={() => dispatch(toggleTheme())}
                        />
                        <Dropdown overlay={userMenu} trigger={["click"]}>
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="avatar"
                                className="rounded-full w-8 h-8 cursor-pointer"
                            />
                        </Dropdown>
                    </div>
                </Header>

                <Content className="p-6 bg-gray-50 dark:bg-[#1a1a1a] text-black dark:text-white">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                        {breadcrumbs.map((crumb, index) => (
                            <Breadcrumb.Item key={index}>{crumb}</Breadcrumb.Item>
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
