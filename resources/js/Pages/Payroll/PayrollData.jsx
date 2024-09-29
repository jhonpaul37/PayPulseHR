import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

//format PHP Peso
const PhpFormat = (params) => {
    const value = parseFloat(params.value);
    if (isNaN(value)) {
        return '';
    }
    return `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollData = ({ auth, employee }) => {
    const [rowData, setRowData] = useState(employee);

    const columnDefs = [
        { headerName: 'EMPLOYEE NO', field: 'employee_id', editable: false },
        {
            headerName: 'EMPLOYEE NAME',
            valueGetter: (params) => {
                const firstName = params.data.first_name || '';
                const middleName = params.data.middle_name ? ` ${params.data.middle_name}` : '';
                const lastName = params.data.last_name || '';
                return `${firstName}${middleName} ${lastName}`.trim();
            },
            filter: 'colFilter',
        },
        { headerName: 'SG', field: 'sg', editable: true },
        { headerName: 'STEP', field: 'step', editable: true },
        {
            headerName: 'SG-STEP',
            valueGetter: (params) => {
                const sg = params.data.sg || '';
                const step = params.data.step || '';
                return `${sg} - ${step}`; // Compute SG-STEP value
            },
            editable: false, // SG-STEP is computed, not editable
        },
        { headerName: 'POSITION', field: 'position', editable: false, filter: 'colFilter' },
        {
            headerName: 'BASIC PAY',
            field: 'salary',
            editable: true,
            valueFormatter: PhpFormat,
        },
        {
            headerName: 'LWOP-BASIC',
            field: 'lwopBasic',
            editable: true,
            valueFormatter: PhpFormat,
        },
        {
            headerName: 'NET-BASIC',
            field: 'netBasic',
            editable: false, // Calculated field
            valueGetter: (params) => {
                const basicPay = parseFloat(params.data.salary) || 0;
                const lwopBasic = parseFloat(params.data.lwopBasic) || 0;
                return basicPay - lwopBasic;
            },
            valueFormatter: PhpFormat,
        },

        {
            headerName: 'PERA',
            field: 'pera',
            editable: true,
            valueFormatter: PhpFormat,
        },
        {
            headerName: 'LWOP-PERA',
            field: 'lwopPera',
            editable: true,
            valueFormatter: PhpFormat,
        },
        {
            headerName: 'NET PERA',
            field: 'netPera',
            editable: false, // Calculated field
            valueGetter: (params) => {
                const pera = parseFloat(params.data.pera) || 0;
                const lwopPera = parseFloat(params.data.lwopPera) || 0;
                return pera + lwopPera;
            },
            valueFormatter: PhpFormat,
        },
    ];

    // Function to handle cell value changes
    const onCellValueChanged = (params) => {
        const updatedRow = params.data;
        const updatedData = rowData.map((row) =>
            row.employee_id === updatedRow.employee_id ? updatedRow : row
        );
        setRowData(updatedData); // Update state with the new data
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="ag-theme-alpine" style={{ height: 485, width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onCellValueChanged={onCellValueChanged}
                    rowHeight={24}
                    defaultColDef={{
                        resizable: true,
                    }}
                    pagination={true}
                    paginationPageSize={15}
                    domLayout="normal"
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default PayrollData;
