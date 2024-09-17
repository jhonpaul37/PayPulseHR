import React, { useState, useMemo } from 'react';
import { useTable } from 'react-table';
import { Inertia } from '@inertiajs/inertia';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

export default function Spreadsheet({ data }) {
    const [tableData, setTableData] = useState(data || []);

    const columns = useMemo(
        () => [
            {
                Header: 'Column 1',
                accessor: 'col1', // Accessor is the "key" in the data
            },
            {
                Header: 'Column 2',
                accessor: 'col2',
            },
        ],
        []
    );

    const updateTable = () => {
        Inertia.post('/spreadsheet/update', { data: tableData });
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: tableData,
    });

    const saveData = () => {
        Inertia.post('/spreadsheet/update', { data: tableData });
    };

    return (
        <div>
            <div>
                <table {...getTableProps()} style={{ border: '1px solid black' }}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button onClick={updateTable}>Save Table</button>
            </div>
            <div>
                <HotTable
                    data={tableData}
                    colHeaders={true}
                    rowHeaders={true}
                    contextMenu={true}
                    afterChange={(changes, source) => {
                        if (source !== 'loadData') {
                            setTableData([...tableData]);
                        }
                    }}
                />
                <button onClick={saveData}>Save Table</button>
            </div>
        </div>
    );
}
