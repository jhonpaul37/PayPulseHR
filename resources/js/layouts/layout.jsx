import React, { useState } from 'react';

// intertia
import { Link, usePage } from '@inertiajs/react';

// Font Awesome icon
import {
    faHouse,
    faGear,
    faAddressBook,
    faFolder,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Ant design icon
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

const { Header, Sider, Content } = Layout;

// Styled components
import styled from 'styled-components';
// this is the style
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
                    <Menu.Item
                        key="1"
                        icon={<FontAwesomeIcon icon={faHouse} />}
                    >
                        <Link href="/">Dashboard</Link>
                    </Menu.Item>

                    {/* <Menu.Item
                        key="2"
                        icon={<FontAwesomeIcon icon={faAddressBook} />}
                    >
                        <Link href="/dashboard">Dashboard</Link>
                    </Menu.Item> */}

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

            {/* navbar */}
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
                    {/* search */}
                    <div>search</div>

                    <div>User Profile</div>
                </Header>

                {/* content below */}
                <Content className="m-8 rounded-md bg-white p-10">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
