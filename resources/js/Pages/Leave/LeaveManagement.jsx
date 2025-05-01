import React from 'react';
import { useRoute } from '@ziggy';
import { Link } from '@inertiajs/react';
import { Badge } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LeaveManagement({ auth, badgeCounts = {} }) {
    const route = useRoute();

    const items = [
        {
            name: 'Leave Credit',
            route: route('LeaveCredit'),
            description: 'View your available leave credits.',
        },
        {
            name: 'Request Leave',
            route: route('LeaveRequest'),
            description: 'Submit a new leave request.',
            badge: badgeCounts.requestLeave || 0,
        },
        {
            name: 'For Review',
            route: route('forReview'),
            description: 'Review and manage submitted leave requests.',
            badge: badgeCounts.forReview || 0,
        },
        {
            name: 'Approved',
            route: route('LeaveStatus'),
            description: 'Track leave requests (Approved/Disapproved).',
            badge: badgeCounts.approved || 0,
        },
        {
            name: 'Application for Leave',
            route: route('leave.request.hr.form'),
            description: 'Fill out a formal leave application.',
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="border-b pb-6">
                <header className="text-xl font-bold">Leave Management</header>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.route}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-200 hover:bg-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{item.name}</h2>
                            {item.badge > 0 && <Badge count={item.badge} offset={[10, 0]} />}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    </Link>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
