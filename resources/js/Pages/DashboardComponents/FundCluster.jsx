import React from 'react';
import PropTypes from 'prop-types';

const FundCluster = ({ fundClusters = [] }) => {
    return (
        <div className="rounded-md bg-high p-2">
            <h2>Fund Clusters</h2>
            <ul>
                {fundClusters.length === 0 ? (
                    <li>No data available</li>
                ) : (
                    fundClusters.map((cluster) => (
                        <li key={cluster.id}>
                            <strong>{cluster.cluster_code}</strong>:{' '}
                            {cluster.desc} - ${cluster.amount}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

FundCluster.propTypes = {
    fundClusters: PropTypes.array,
};

export default FundCluster;
