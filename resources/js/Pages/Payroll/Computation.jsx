import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Payroll from './Payroll';

const EmployeeList = ({ auth, employee }) => {
    // Define the columns for the ag-Grid
    const columnDefs = [
        { headerName: 'EMPLOYEE NO', field: 'employee_id' },
        {
            headerName: 'EMPLOYEE NAME',
            valueGetter: (params) => {
                const firstName = params.data.first_name || '';
                const middleName = params.data.middle_name ? ` ${params.data.middle_name}` : '';
                const lastName = params.data.last_name || '';
                return `${firstName}${middleName} ${lastName}`.trim();
            },
        },
        { headerName: 'SG-STEP', field: '' },
        { headerName: 'POSITION', field: 'position' },
        { headerName: 'LWOP', field: '' },
        { headerName: 'NET-BASIC', field: 'salary' },
        { headerName: 'PERA', field: '' },
        { headerName: 'LWOP-PERA', field: '' },
        { headerName: 'NET-PERA', field: '' },
        { headerName: 'RATA', field: '' },
        { headerName: 'TOTAL', field: '' },
        { headerName: 'TAX', field: '' },
        { headerName: 'GSIS PREM', field: '' },
        { headerName: 'HDMF PREM1', field: '' },
        { headerName: 'HDMF PREM2', field: '' },
        { headerName: 'PHIC', field: '' },
        { headerName: 'GFAL', field: '' },
        { headerName: 'MPL', field: '' },
        { headerName: 'CONSO LOAN', field: '' },
        { headerName: 'CPL', field: '' },
        { headerName: 'EMRGNCY', field: '' },
        { headerName: 'GSIS POLICY', field: '' },
        { headerName: 'SG', field: '' },
        { headerName: 'seq.', field: '' },
        { headerName: 'SIGNATURE', field: '' },
        { headerName: 'REMARKS', field: '' },
    ];

    return (
        <Payroll auth={auth}>
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact rowData={employee} columnDefs={columnDefs} />
            </div>
        </Payroll>
    );
};

export default EmployeeList;
