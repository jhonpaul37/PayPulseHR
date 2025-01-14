import React from 'react';

const Dashboards = ({ roles }) => {
    const rolesList = roles || [];
    return (
        <div>
            <h1>Dashboard</h1>
            {rolesList.includes('admin') && <button className="p-5">Welcome Admin</button>}
            {rolesList.includes('manager') && <button>Manager Panel</button>}
        </div>
    );
};

export default Dashboards;
