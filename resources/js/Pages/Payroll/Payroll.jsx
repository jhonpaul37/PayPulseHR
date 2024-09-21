import React, { useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Payroll = ({ auth, children }) => {
    const [current, setCurrent] = useState('mail');
    const { url } = usePage();

    // Set default redirect to /payroll/general if no specific route is set
    useEffect(() => {
        if (url === '/payroll' || url === '/payroll/') {
            router.visit('/payroll/general'); // Redirect to /payroll/general
        } else if (url.includes('/payroll/general')) {
            setCurrent('mail');
        } else if (url.includes('/payroll/computation')) {
            setCurrent('app');
        }
    }, [url]);

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const items = [
        {
            label: <Link href="/payroll/general">General Payroll</Link>,
            key: 'mail',
            icon: <MailOutlined />,
        },
        {
            label: <Link href="/payroll/computation">Computation</Link>,
            key: 'app',
            icon: <AppstoreOutlined />,
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <div className="content">{children}</div>
        </AuthenticatedLayout>
    );
};

export default Payroll;
