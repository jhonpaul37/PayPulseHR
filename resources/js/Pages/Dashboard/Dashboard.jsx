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
import { Form, Modal, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Dragger } = Upload;

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
    const { data, setData, post, processing, errors } = useForm({
        csv_file: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = (file) => {
        setData('csv_file', file);
        message.success(`File "${file.name}" selected successfully.`);
        return false; // Prevent default upload behavior.
    };

    const handleSubmit = () => {
        if (!data.csv_file) {
            message.error('Please select a CSV file before uploading.');
            return;
        }
        post('/fund-cluster/upload', {
            onSuccess: () => {
                message.success('Fund Clusters updated successfully!');
                setIsModalOpen(false);
            },
            onError: () => {
                message.error('Failed to upload the file. Please try again.');
            },
        });
    };

    return (
        <div className="rounded-md border p-3 shadow">
            <h2 className="mb-3 text-xl font-bold">Balance Accounts</h2>

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
                    <PrimaryButton
                        key="upload"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? 'Uploading...' : 'Upload CSV'}
                    </PrimaryButton>,
                ]}
            >
                <Dragger
                    name="csv_file"
                    accept=".csv"
                    multiple={false}
                    beforeUpload={handleFileChange}
                    className="p-4"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Ensure the file is in CSV format and follows the required structure.
                    </p>
                </Dragger>
            </Modal>

            {/* Display fund clusters */}
            {fundClusters.length === 0 ? (
                <div>No data available</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {fundClusters.map((cluster) => (
                        <div
                            key={cluster.id}
                            className="flex flex-col rounded-md border bg-gray-100 p-3"
                        >
                            <span>Total Balance:</span>
                            <strong className="text-xl font-bold">
                                ₱{cluster.amount.toLocaleString()}
                            </strong>
                            <span>Cluster {cluster.cluster_code}</span>
                        </div>
                    ))}
                </div>
            )}
            {/* Button to open the modal */}
            <PrimaryButton
                onClick={() => setIsModalOpen(true)}
                className="mt-4"
                disabled={processing}
            >
                Upload CSV
            </PrimaryButton>
        </div>
    );
};

FundCluster.propTypes = {
    fundClusters: PropTypes.array,
};

const Dashboard = ({ auth }) => {
    const { chartData = { labels: [], data: [] }, fundClusters = [], csrfToken } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div>
                <div className="flex flex-col">
                    <div className="mb-10">
                        <FundCluster fundClusters={fundClusters} csrfToken={csrfToken} />
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
