import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faGear,
    faFolder,
    faUsers,
    faHeartPulse,
    faHandHoldingDollar,
} from '@fortawesome/free-solid-svg-icons';
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

    .ant-menu-item-group-title {
        color: white !important;
        font-weight: bold;
        padding-left: 24px;
    }
    .ant-menu-item-divider {
        background-color: white !important;
        height: 1px;
        margin: 8px 0;
    }

    /* Ensure the "Leaves" text stays white */
    .ant-menu-submenu-title {
        color: white !important;
    }
`;

const ScrollableContent = styled(Content)`
    margin: 2rem;
    padding: 2.5rem;
    background-color: white;
    border-radius: 0.5rem;
    overflow-y: auto;
    flex-grow: 1;
`;

const AuthenticatedLayout = ({ user, children }) => {
    const [collapsed, setCollapsed] = useState(false); //true is  close by default sidebar
    const { url, props } = usePage();
    const { auth } = props;

    // const selectedKey = () => {
    //     // if (url.startsWith('/dashboard')) return '1';
    //     if (url.startsWith('/dashboard')) return '2';
    //     if (url.startsWith('/voucher')) return '3';
    //     if (url.startsWith('/settings')) return '4';
    //     if (url.startsWith('/leaveRequest')) return '5';
    //     if (url.startsWith('/employees')) return '6';
    //     if (url.startsWith('/payroll/data')) return '7';
    //     if (url.startsWith('/loans')) return '8';
    //     if (url.startsWith('/employee_benefits')) return '9';
    //     if (url.startsWith('/leaveRequestForm')) return '10';
    //     if (url.startsWith('/my_loans')) return '11';
    //     return '1';
    // };
    const selectedKey = () => {
        if (url === '/dashboard') return '2';
        if (url === '/voucher') return '3';
        if (url === '/settings') return '4';
        if (url === '/leaveRequest') return '5';
        if (url === '/employees') return '6';
        if (url.startsWith('/payroll/data')) return '7';
        if (url === '/loans') return '8';
        if (url === '/employee_benefits') return '9';
        if (url === '/leaveRequestForm') return '10';
        if (url === '/my_loans') return '11';
        if (url === '/contributions') return '12';
        if (url === '/salary_grades') return '13';
        return '1'; // Default case
    };

    const menuItems = [
        {
            key: 'payrollTitle',
            label: !collapsed ? 'Cashier' : null,
            type: 'group',
        },
        {
            key: '7',
            icon: <FontAwesomeIcon icon={faHouse} />,
            label: <Link href="/payroll/data">Payroll</Link>,
        },
        {
            key: '8',
            icon: <FontAwesomeIcon icon={faHandHoldingDollar} />,
            label: <Link href="/loans">Loans</Link>,
            // label: 'Deduction',
            // children: [
            //     // {
            //     //     key: '8-1',
            //     //     label: <Link href="/my_loans">My Loans (Employee)</Link>,
            //     // },
            //     {
            //         key: '8-2',
            //         label: <Link href="/loans">Loans</Link>,
            //     },
            //     {
            //         key: '8-3',
            //         label: <Link href="/contributions">Deduction</Link>,
            //     },
            //     {
            //         key: '8-4',
            //         label: <Link href="/salary_grades">Salary Grade</Link>,
            //     },
            // ],
        },
        {
            type: 'divider',
        },
        {
            key: 'accountingTitle',
            label: !collapsed ? 'Accounting' : null,
            type: 'group',
        },
        {
            key: '2',
            icon: <FontAwesomeIcon icon={faHouse} />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
            key: '3',
            icon: <FontAwesomeIcon icon={faFolder} />,
            label: <Link href="/voucher">Voucher</Link>,
        },
        {
            key: '9',
            icon: <FontAwesomeIcon icon={faHouse} />,
            label: <Link href="/employee_benefits">Gross Earnings</Link>,
        },
        {
            key: '12',
            icon: <FontAwesomeIcon icon={faFolder} />,
            label: <Link href="/contributions">Deduction</Link>,
        },
        {
            key: '13',
            icon: <FontAwesomeIcon icon={faFolder} />,
            label: <Link href="/salary_grades">Salary Grade</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: 'hrTitle',
            label: !collapsed ? 'HR' : null,
            type: 'group',
        },
        {
            key: '5',
            icon: <FontAwesomeIcon icon={faHeartPulse} />,
            label: <Link href="/leaveRequest">Leaves Request</Link>,
            // label: 'Leaves',
            // children: [
            //     {
            //         key: '5-1',
            //         label: <Link href="/leaveRequestForm">Add Leave (Employee)</Link>,
            //     },
            //     {
            //         key: '5-2',
            //         label: <Link href="/leaveRequest">Leaves Request</Link>,
            //     },
            // ],
        },
        {
            key: '6',
            icon: <FontAwesomeIcon icon={faUsers} />,
            label: <Link href="/employees">Employees</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: 'employeeTitle',
            label: !collapsed ? 'Employee' : null,
            type: 'group',
        },
        {
            key: '11',
            icon: <FontAwesomeIcon icon={faHouse} />,
            label: <Link href="/my_loans">Dashboard</Link>,
        },
        {
            key: '10',
            icon: <FontAwesomeIcon icon={faHeartPulse} />,
            label: <Link href="/leaveRequestForm">Leave</Link>,
        },
        // {
        //     key: 'dashboardLanding',
        //     icon: <FontAwesomeIcon icon={faHouse} />,
        //     label: <Link href="/dashboards">Dashboard</Link>,
        // },

        // {
        //     type: 'divider',
        // },
        // {
        //     key: '4',
        //     icon: <FontAwesomeIcon icon={faGear} />,
        //     label: <Link href="/settings">Settings</Link>,
        // },
    ];

    return (
        <div>
            <Layout className="h-screen">
                <StyledSider trigger={null} collapsible collapsed={collapsed}>
                    <div className="relative flex h-16 items-center justify-center bg-mainD">
                        {/* Display the logo only when collapsed */}
                        <img
                            src="/images/PayPulseHR.png"
                            alt="PayPulseHR Logo"
                            className={`h-12 ${collapsed ? 'block' : 'block'}`}
                        />
                        {/* Display text when not collapsed */}
                        <span className={`font-bold text-white ${collapsed ? 'hidden' : 'block'}`}>
                            PayPulseHR
                        </span>
                    </div>
                    <StyledMenu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedKey()]}
                        items={menuItems}
                        className="text-white-50 bg-main"
                    />
                </StyledSider>

                {/* Navbar */}
                <Layout className="flex h-screen flex-col">
                    <Header className="flex justify-between bg-white shadow-md">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="h-16 w-16 text-lg"
                        />
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
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
        </div>
    );
};

export default AuthenticatedLayout;
