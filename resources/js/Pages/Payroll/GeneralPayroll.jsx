import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Payroll from './Payroll';

const GeneralPayroll = ({ auth, employee }) => {
    // Ensure the auth object is available and has the user data
    if (!auth || !auth.user) {
        return <div>Error: User not authenticated</div>;
    }

    // Dummy data for the grid
    const rowData = [
        { id: 1, name: 'John Doe', salary: 50000 },
        { id: 2, name: 'Jane Smith', salary: 55000 },
        { id: 3, name: 'Mike Johnson', salary: 60000 },
    ];

    // Define column definitions
    const columnDefs = [
        { headerName: 'EMPLOYEE ID', field: 'id' },
        { headerName: 'EMPLOYEE NAME', field: 'name' },
        { headerName: 'SG-STEP', field: 'salary' },
        { headerName: 'POSITION', field: 'salary' },
        { headerName: 'LWOP', field: 'salary' },
        { headerName: 'NET-BASIC', field: 'salary' },
        { headerName: 'PERA', field: 'salary' },
        { headerName: 'LWOP-PERA', field: 'salary' },
        { headerName: 'NET-PERA', field: 'salary' },
        { headerName: 'RATA', field: 'salary' },
        { headerName: 'TOTAL', field: 'salary' },
        { headerName: 'TAX', field: 'salary' },
        { headerName: 'GSIS PREM', field: 'salary' },
        { headerName: 'HDMF PREM1', field: 'salary' },
        { headerName: 'HDMF PREM2', field: 'salary' },
        { headerName: 'PHIC', field: 'salary' },
        { headerName: 'GFAL', field: 'salary' },
        { headerName: 'MPL', field: 'salary' },
        { headerName: 'CONSO LOAN', field: 'salary' },
        { headerName: 'CPL', field: 'salary' },
        { headerName: 'EMRGNCY', field: 'salary' },
        { headerName: 'GSIS POLICY', field: 'salary' },
        { headerName: 'SG', field: 'salary' },
        { headerName: 'seq.', field: 'salary' },
        { headerName: 'SIGNATURE', field: 'salary' },
        { headerName: 'REMARKS', field: 'salary' },
    ];

    return (
        <Payroll auth={auth}>
            <div className="p-4">
                <header className="mb-4 text-center text-xl font-bold">
                    GENERAL PAYROLL {employee.employee_id}
                </header>
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        // Additional options and events can be added here
                    />
                </div>
            </div>
        </Payroll>
    );
};

export default GeneralPayroll;
