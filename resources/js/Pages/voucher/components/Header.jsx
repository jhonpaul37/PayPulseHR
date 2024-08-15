import React from 'react';

const Header = ({
    fundClusters,
    formData,
    handleInputChange,
    updateGeneratedCode,
    currentDate,
}) => {
    return (
        <div className="mb-4 border-2 border-black">
            <div className="grid grid-cols-6 text-xs">
                <div className="col-span-5 flex items-center justify-center font-bold">
                    DISBURSEMENT VOUCHER
                </div>
                <div className="border-l-2 border-black">
                    <div className="border-b border-black p-1">
                        Fund Cluster:
                        <select
                            name="fundCluster"
                            value={formData.fundCluster}
                            onChange={handleInputChange}
                            onBlur={updateGeneratedCode}
                            className="w-full"
                        >
                            <option value="">Select Fund Cluster</option>
                            {fundClusters.map((cluster) => (
                                <option
                                    key={cluster.F_cluster}
                                    value={cluster.F_cluster}
                                >
                                    {cluster.F_cluster}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="border-b border-black p-1">
                        Date: {currentDate}
                    </div>
                    <div className="p-1">DV No.</div>
                </div>
            </div>
        </div>
    );
};

export default Header;
