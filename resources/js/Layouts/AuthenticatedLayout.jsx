import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear, faFolder } from '@fortawesome/free-solid-svg-icons';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

// Styled components
const StyledSider = styled(Sider)`
    background-color: #741d20 !important;
`;

const StyledMenu = styled(Menu)`
    .ant-menu-item {
        color: white !important;
    }

    .ant-menu-item-icon {
        color: white !important;
    }

    .ant-menu-item-selected {
        background-color: #f0c519 !important;
        color: white !important;
    }
`;

const ScrollableContent = styled(Content)`
    margin: 2rem; /* Equivalent to m-8 in Tailwind */
    padding: 2.5rem; /* Equivalent to p-10 in Tailwind */
    background-color: white;
    border-radius: 0.5rem; /* Equivalent to rounded-md in Tailwind */
    overflow-y: auto;
    flex-grow: 1;
`;

const AuthenticatedLayout = ({ user, header, children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const { url, props } = usePage();
    const { auth } = props;

    const selectedKey = () => {
        if (url.startsWith('/dashboard')) return '1';
        if (url.startsWith('/voucher')) return '3';
        if (url.startsWith('/settings')) return '4';
        if (url.startsWith('/leave')) return '5';
        return '1'; // Default to Home
    };
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const menuItems = [
        {
            key: '1',
            icon: <FontAwesomeIcon icon={faHouse} />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
            key: '3',
            icon: <FontAwesomeIcon icon={faFolder} />,
            label: <Link href="/voucher">Voucher</Link>,
        },
        {
            key: '4',
            icon: <FontAwesomeIcon icon={faGear} />,
            label: <Link href="/settings">Settings</Link>,
        },
        {
            key: '5',
            icon: <FontAwesomeIcon icon={faFolder} />,
            label: <Link href="/leave">Leave</Link>,
        },
    ];

    return (
        <Layout className="h-screen">
            <StyledSider trigger={null} collapsible collapsed={collapsed}>
                <div className="flex h-16 items-center justify-center bg-mainD">
                    <span className="text-xl text-white">Logo</span>
                </div>
                <StyledMenu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey()]}
                    items={menuItems}
                    className="bg-main"
                />
            </StyledSider>

            {/* Navbar */}
            <Layout className="flex h-screen flex-col">
                <Header className="flex justify-between bg-white shadow-md">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        className="h-16 w-16 text-lg"
                    />
                    <div>Search</div>
                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                        <div className="relative ms-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            {user.name}

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                <ScrollableContent>{children}</ScrollableContent>
            </Layout>
        </Layout>
    );
};

export default AuthenticatedLayout;
