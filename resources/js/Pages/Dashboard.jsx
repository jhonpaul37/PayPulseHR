import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FundCluster from '@/Pages/Dashboard/FundCluster';
import ChartComponent from '@/Pages/Dashboard/ChartComponent';
import { usePage } from '@inertiajs/react';

const Dashboard = ({ auth }) => {
    const { chartData, fundClusters } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <div className="flex flex-col">
                    <div className="mb-10">
                        <FundCluster fundClusters={fundClusters} />
                    </div>
                    <div className="w-full rounded-md border p-2">
                        <ChartComponent chartData={chartData} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
