import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
const JevGen = () => {
    const [selectedCluster, setSelectedCluster] = useState('');
    const [autoIncrement, setAutoIncrement] = useState(1);
    const [generatedCode, setGeneratedCode] = useState('');

    useEffect(() => {
        if (selectedCluster) {
            fetchAutoIncrementValue(selectedCluster);
        }
    }, [selectedCluster]);

    const fetchAutoIncrementValue = (cluster) => {
        Inertia.get(
            `/api/auto-increment/${cluster}`,
            {},
            {
                onSuccess: (response) => {
                    const autoIncrementValue =
                        parseInt(response.props.autoIncrement, 10) || 1;
                    setAutoIncrement(autoIncrementValue);
                    generateCode(cluster, autoIncrementValue);
                },
            }
        );
    };

    const generateCode = (clusterNumber, autoIncrement) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const cluster = clusterNumber.toString().padStart(2, '0');
        const increment = autoIncrement.toString().padStart(4, '0');

        const code = `${year}${month}-${cluster}-CHKDJ-${increment}`;
        setGeneratedCode(code);
    };

    const saveGeneratedCode = () => {
        Inertia.post(
            '/api/save-code',
            { generatedCode },
            {
                onSuccess: () => {
                    console.log('Code saved successfully');
                },
            }
        );
    };
    return (
        <div className="jev-acc jev-acc-no">
            <div className="bank-acc">
                <span>
                    Bank Name & Account Number: <input type="text" />
                </span>
            </div>
            <div className="Jev-no">
                JEV No.
                <input
                    type="text"
                    name="generatedCode"
                    id="generatedCode"
                    className="generatedCode"
                    value={generatedCode}
                    readOnly
                />
            </div>
            <select onChange={(e) => setSelectedCluster(e.target.value)}>
                <option value="">Select Cluster</option>
                <option value="1">Cluster 1</option>
                <option value="2">Cluster 2</option>
                {/* Add more clusters as needed */}
            </select>
            <button onClick={saveGeneratedCode}>Save Code</button>
        </div>
    );
};

export default JevGen;
