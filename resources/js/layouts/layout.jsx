import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

// // Styled components
const StyledSider = styled(Sider)`
    background-color: #741d20 !important;
`;
const StyledMenu = styled(Menu)`
    .ant-menu-item {
        color: white !important; /* Set the default text color to white */
    }

    .ant-menu-item-icon {
        color: white !important; /* Set the default icon color to white */
    }

    .ant-menu-item-selected {
        background-color: #f0c519 !important;
        color: white !important; /* Set the selected text color to black */
    }
`;

const App = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const { url } = usePage();

    // Determine the active menu item based on the current URL
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
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link href="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <Link href="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        <Link href="/voucher">Voucher</Link>
                    </Menu.Item>
                </StyledMenu>
            </StyledSider>
            <Layout>
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
                    <div>Search Bar</div>
                    <div>User Profile</div>
                </Header>
                <Content className="m-8 rounded-md bg-white p-10">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
