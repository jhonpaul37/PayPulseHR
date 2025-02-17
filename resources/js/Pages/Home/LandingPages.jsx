import React from 'react';
import { Typography, Layout } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Content } = Layout;
const { Title, Text } = Typography;

const LandingPage = ({ auth, user, date }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Add a role-based subtitle or navigation
    const getRoleSpecificText = () => {
        switch (user.role) {
            case 'Admin':
                return 'Manage users, settings, and overall operations.';
            case 'HR':
                return 'Handle employee records, benefits, and more.';
            case 'Cashier':
                return 'View and process payroll and deductions.';
            case 'Employee':
                return 'Check your records and requests here.';
            default:
                return 'Welcome to PayPulseHR!';
        }
    };
    console.log('User in LandingPage:', user);
    // console.log('Auth in LandingPage:', auth);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Layout>
                <Content style={{ padding: '2rem', textAlign: 'center' }}>
                    <Title level={3} style={{ marginBottom: '16px' }}>
                        {`${getGreeting()}, ${user.name || user.first_name || 'Employee'}!`}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px', display: 'block' }}>
                        Today is {date}.
                    </Text>
                    <Text style={{ marginTop: '16px', fontSize: '18px', display: 'block' }}>
                        {getRoleSpecificText()}
                    </Text>
                </Content>
            </Layout>
        </AuthenticatedLayout>
    );
};

export default LandingPage;
