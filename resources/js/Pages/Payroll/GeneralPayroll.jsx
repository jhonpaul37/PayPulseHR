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

const GeneralPayroll = ({ auth, employee }) => {
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
        { headerName: 'SG-STEP', field: '', editable: true },
        { headerName: 'POSITION', field: 'position', editable: false, filter: 'colFilter' },
        { headerName: 'BASIC PAY', field: 'salary', editable: true, valueFormatter: PhpFormat },
        { headerName: 'LWOP', field: '', editable: true },
        { headerName: 'NET-BASIC', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'PERA', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'LWOP-PERA', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'NET-PERA', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'RATA', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'TOTAL', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'TAX', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'GSIS PREM', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'HDMF PREM1', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'HDMF PREM2', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'PHIC', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'GFAL', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'MPL', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'CONSO LOAN', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'CPL', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'EMRGNCY', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'GSIS POLICY', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'SG', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'seq.', field: '', editable: true, valueFormatter: PhpFormat },
        { headerName: 'SIGNATURE', field: '', editable: false },
        { headerName: 'REMARKS', field: '', editable: true },
    ];

    // Function to handle cell value changes
    const onCellValueChanged = (params) => {
        const updatedData = [...rowData];
        const updatedRow = params.data;
        const index = updatedData.findIndex((row) => row.employee_id === updatedRow.employee_id);
        updatedData[index] = updatedRow;
        setRowData(updatedData);
        console.log('Updated row:', updatedRow);
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

export default GeneralPayroll;
