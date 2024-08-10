import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

const { Header, Sider, Content } = Layout;

const App = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <Layout className="h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ backgroundColor: '#741D20' }}
            >
                <div className="bg-mainD flex h-16 items-center justify-center">
                    <span className="text-xl text-white">Logo</span>{' '}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link href="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <Link href="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        <Link href="/voucher">Voucher</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
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
                    <div>user profile</div>
                </Header>
                <Content className="m-8 rounded-md bg-white p-10">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
