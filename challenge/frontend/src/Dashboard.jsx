import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ token, onLogout }) => {
    const [openCases, setOpenCases] = useState(0);
    const [closedCases, setClosedCases] = useState(0);
    const [topComplaint, setTopComplaint] = useState("");
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const headers = {
            Authorization: `Token ${token}`,
        };

        axios.get('http://localhost:8000/api/complaints/openCases/', { headers })
            .then(res => setOpenCases(res.data.length))
            .catch(err => console.error('Error fetching open cases:', err));

        axios.get('http://localhost:8000/api/complaints/closedCases/', { headers })
            .then(res => setClosedCases(res.data.length))
            .catch(err => console.error('Error fetching closed cases:', err));

        axios.get('http://localhost:8000/api/complaints/topComplaints/', { headers })
            .then(res => {
                const complaints = res.data;

                // Count occurrences of each complaint_type
                const counts = {};
                complaints.forEach(item => {
                    const type = item.complaint_type;
                    if (type) {
                        counts[type] = (counts[type] || 0) + 1;
                    }
                });

                // Sort types by frequency and get top 3
                const topTypes = Object.entries(counts)
                    .sort((a, b) => b[1] - a[1])  // sort by count descending
                    .slice(0, 3)                   // get top 3
                    .map(([type]) => type);       // extract just the type

                // Join into a single comma-separated string
                const topTypesString = topTypes.join(', ');

                // Save to state
                setTopComplaint(topTypesString);
            })
            .catch(err => console.error('Error fetching top complaints:', err));


        axios.get('http://localhost:8000/api/complaints/allComplaints/', { headers })
            .then(res => setComplaints(res.data))
            .catch(err => console.error('Error fetching all complaints:', err));
    }, [token]);

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
            <p>Your token: {token}</p>
            <button onClick={onLogout}>Logout</button>

            <div style={{ marginTop: 20 }}>
                <p><strong>Open Cases:</strong> {openCases}</p>
                <p><strong>Closed Cases:</strong> {closedCases}</p>
                <p><strong>Top Complaint Type:</strong> {topComplaint}</p>
            </div>

            <h3 style={{ marginTop: 30 }}>All Complaints in Your District</h3>
            <table border="1" cellPadding="6" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Complaint Type</th>
                        <th>Descriptor</th>
                        <th>Open Date</th>
                        <th>Close Date</th>
                        <th>Borough</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((c, index) => (
                        <tr key={index}>
                            <td>{c.complaint_type}</td>
                            <td>{c.descriptor}</td>
                            <td>{c.opendate}</td>
                            <td>{c.closedate || "—"}</td>
                            <td>{c.borough}</td>
                            <td>{c.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
