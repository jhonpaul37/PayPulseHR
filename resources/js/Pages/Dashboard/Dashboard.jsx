import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Form, Modal, Input } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ chartData }) => {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Expenses',
                data: chartData.data,
                backgroundColor: '#741D20',
                borderColor: '#5F1415',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-[500px] w-full">
            <Bar data={data} options={options} />
        </div>
    );
};

ChartComponent.propTypes = {
    chartData: PropTypes.shape({
        labels: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
    }).isRequired,
};

const FundCluster = ({ fundClusters = [] }) => {
    const { post, processing, errors } = useForm({
        csv_file: null,
    });

    const [fileName, setFileName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            post.setData('csv_file', file);
        }
    };

    const handleSubmit = (values) => {
        post('/fund-cluster/upload', {
            onSuccess: () => {
                setFileName('');
                alert('Fund Clusters updated successfully!');
                setIsModalOpen(false); // Close modal after successful upload
            },
        });
    };

    return (
        <div className="rounded-md border p-3 shadow">
            <h2 className="mb-3 font-bold">Balance Accounts</h2>

            {/* Button to open the modal */}
            <PrimaryButton
                onClick={() => setIsModalOpen(true)}
                className="mb-4"
                disabled={processing}
            >
                Upload CSV
            </PrimaryButton>

            {/* Modal */}
            <Modal
                title="Upload Fund Cluster CSV"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <DangerButton
                        key="cancel"
                        onClick={() => setIsModalOpen(false)}
                        style={{ marginRight: '8px' }}
                    >
                        Cancel
                    </DangerButton>,
                    <PrimaryButton key="upload" type="submit" disabled={processing}>
                        Upload CSV
                    </PrimaryButton>,
                ]}
            >
                <Form
                    onFinish={handleSubmit}
                    className="flex flex-col gap-2"
                    encType="multipart/form-data"
                >
                    <Form.Item
                        name="csv_file"
                        rules={[{ required: true, message: 'Please upload a CSV file' }]}
                    >
                        <Input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full rounded border p-2"
                        />
                    </Form.Item>

                    {errors.csv_file && (
                        <div className="text-sm text-red-500">{errors.csv_file}</div>
                    )}
                </Form>
            </Modal>

            {/* Display fund clusters */}
            {fundClusters.length === 0 ? (
                <div>No data available</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fundClusters.map((cluster) => (
                        <div
                            key={cluster.id} // Ensure each item has a unique key
                            className="flex flex-col rounded-md border bg-gray-100 p-3"
                        >
                            <span>Total Balance:</span>
                            <strong className="text-xl font-bold">
                                ₱{cluster.amount.toLocaleString()}
                            </strong>
                            <span>Cluster Code: {cluster.cluster_code}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

FundCluster.propTypes = {
    fundClusters: PropTypes.array,
};

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

Dashboard.propTypes = {
    auth: PropTypes.shape({
        user: PropTypes.object.isRequired,
    }).isRequired,
};

export default Dashboard;
