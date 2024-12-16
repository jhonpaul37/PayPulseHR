import React from 'react';
import PropTypes from 'prop-types';

const FundCluster = ({ fundClusters = [] }) => {
    return (
        <div className="rounded-md border p-3 shadow">
            <h2 className="mb-3 font-bold">Balance Accounts</h2>

            <div className="flex w-full justify-between gap-5">
                {fundClusters.length === 0 ? (
                    <div>No data available</div>
                ) : (
                    fundClusters.map((cluster) => (
                        <div
                            key={cluster.id}
                            className="flex w-full flex-col rounded-md border bg-gray-100 p-2"
                        >
                            Total Balance
                            <strong className="text-xl font-bold">
                                ₱{cluster.amount.toLocaleString()}
                            </strong>
                            <span>Cluster {cluster.cluster_code}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

FundCluster.propTypes = {
    fundClusters: PropTypes.array,
};

export default FundCluster;
