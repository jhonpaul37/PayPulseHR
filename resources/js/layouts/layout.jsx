import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear, faFolder } from '@fortawesome/free-solid-svg-icons';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import styled from 'styled-components';

const { Header, Sider } = Layout;

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

const ScrollableContent = styled(Layout.Content)`
    margin: 2rem; /* Equivalent to m-8 in Tailwind */
    padding: 2.5rem; /* Equivalent to p-10 in Tailwind */
    background-color: white;
    border-radius: 0.5rem; /* Equivalent to rounded-md in Tailwind */
    overflow-y: auto;
    flex-grow: 1;
`;

const App = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const { url } = usePage();

    const selectedKey = () => {
        if (url.startsWith('/dashboard')) return '2';
        if (url.startsWith('/voucher')) return '3';
        return '1'; // Default to Home
    };

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
                    className="bg-main"
                >
                    <Menu.Item
                        key="1"
                        icon={<FontAwesomeIcon icon={faHouse} />}
                    >
                        <Link href="/">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="2"
                        icon={<FontAwesomeIcon icon={faHouse} />}
                    >
                        <Link href="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="3"
                        icon={<FontAwesomeIcon icon={faFolder} />}
                    >
                        <Link href="/voucher">Voucher</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<FontAwesomeIcon icon={faGear} />}>
                        <Link href="/settings">Settings</Link>
                    </Menu.Item>
                </StyledMenu>
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
                    {/* Search */}
                    <div>search</div>
                    <div>User Profile</div>
                </Header>

                {/* Scrollable content below with the same design */}
                <ScrollableContent>{children}</ScrollableContent>
            </Layout>
        </Layout>
    );
};

export default App;
