import React from 'react';

const Dashboard = ({ token, onLogout }) => {
    return (
        <div style={{ padding: 20 }}>
            <h2>Welcome to the Dashboard</h2>
            <p>Your token: {token}</p>
            <button onClick={onLogout}>Log Out</button>
        </div>
    );
};

export default Dashboard;