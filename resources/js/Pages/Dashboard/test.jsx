import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const FundCluster = ({ fundClusters = [] }) => {
    const { post, processing, errors } = useForm({
        csv_file: null,
    });

    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            post.setData('csv_file', file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/fund-cluster/upload', {
            onSuccess: () => {
                setFileName('');
                alert('Fund Clusters updated successfully!');
            },
        });
    };

    return (
        <div className="rounded-md border p-3 shadow">
            <h2 className="mb-3 font-bold">Balance Accounts</h2>

            <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-2">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full rounded border p-2"
                />
                {errors.csv_file && <div className="text-sm text-red-500">{errors.csv_file}</div>}
                <button
                    type="submit"
                    className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    disabled={processing}
                >
                    Upload CSV
                </button>
            </form>

            {fundClusters.length === 0 ? (
                <div>No data available</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fundClusters.map((cluster) => (
                        <div
                            key={cluster.id}
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

export default FundCluster;
