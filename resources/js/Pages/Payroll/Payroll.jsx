import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Payroll = ({ auth, children }) => {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState('1');

    // Set default redirect to /payroll/general if no specific route is set
    useEffect(() => {
        if (url === '/payroll' || url === '/payroll/') {
            router.visit('/payroll/general'); // Redirect to /payroll/general
        } else if (url.includes('/payroll/general')) {
            setActiveTab('1');
        } else if (url.includes('/payroll/computation')) {
            setActiveTab('2');
        }
    }, [url]);

    const onTabChange = (key) => {
        setActiveTab(key);
        if (key === '1') {
            router.visit('/payroll/general');
        } else if (key === '2') {
            router.visit('/payroll/computation');
        }
    };

    const items = [
        {
            key: '1',
            label: 'General Payroll',
            icon: <MailOutlined />,
            children: children,
        },
        {
            key: '2',
            label: 'Computation',
            icon: <AppstoreOutlined />,
            children: children,
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Tabs
                defaultActiveKey={activeTab}
                activeKey={activeTab}
                onChange={onTabChange}
                items={items.map((tab) => ({
                    key: tab.key,
                    label: (
                        <span>
                            {tab.icon}
                            {tab.label}
                        </span>
                    ),
                    children: tab.children,
                }))}
            />
        </AuthenticatedLayout>
    );
};

export default Payroll;
