import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Box,
    TablePagination,
} from '@mui/material';
import Header from './components/Header';

const Dashboard = ({ token, onLogout, user }) => {
    const [openCases, setOpenCases] = useState([]);
    const [closedCases, setClosedCases] = useState([]);
    const [topComplaint, setTopComplaint] = useState('');
    const [complaints, setComplaints] = useState([]);
    // const [myDistrict, setMyDistrict] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const headers = {
            Authorization: `Token ${token}`,
        };

        axios
            .get('http://localhost:8000/api/complaints/openCases/', { headers })
            .then(res => setOpenCases(res.data))
            .catch(err => console.error('Error fetching open cases:', err));

        axios
            .get('http://localhost:8000/api/complaints/closedCases/', { headers })
            .then(res => setClosedCases(res.data))
            .catch(err => console.error('Error fetching closed cases:', err));

        axios
            .get('http://localhost:8000/api/complaints/topComplaints/', { headers })
            .then(res => {
                const counts = {};
                res.data.forEach(item => {
                    const type = item.complaint_type;
                    if (type) {
                        counts[type] = (counts[type] || 0) + 1;
                    }
                });

                const topTypes = Object.entries(counts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([type]) => type);

                setTopComplaint(topTypes.join(', '));
            })
            .catch(err => console.error('Error fetching top complaints:', err));

        axios
            .get('http://localhost:8000/api/complaints/allComplaints/', { headers })
            .then(res => setComplaints(res.data))
            .catch(err => console.error('Error fetching all complaints:', err));
    }, [token]);
    const fetchDistrictComplaints = () => {
        const headers = {
            Authorization: `Token ${token}`,
        };

        axios
            .get('http://localhost:8000/api/complaints/myDistrict/', { headers })
            .then(res => {
                setComplaints(res.data)
                // setMyDistrict(res.data);
                setPage(0);
            })
            .catch(err => {
                console.error("Error fetching district complaints:", err);
            });

    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Header name={"Dashboard"} token={token} onLogout={onLogout} user={user} />
            <Container sx={{ py: 2, width: "100%" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Open Cases</Typography>
                                    <Typography variant="h4">{openCases.length}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Closed Cases</Typography>
                                    <Typography variant="h4">{closedCases.length}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Top Complaint Type</Typography>
                                    <br />
                                    <Typography variant="body1">{topComplaint || '—'}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{
                        alignContent: 'end',
                    }}>
                        <Button variant="contained" color="primary" onClick={fetchDistrictComplaints}>
                            Complaints by My Constituents
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mt: 5, mb: 10 }}>
                    <Typography variant="h5" gutterBottom>
                        All Complaints For Your District
                    </Typography>

                    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Complaint Type</TableCell>
                                    <TableCell>Descriptor</TableCell>
                                    <TableCell>Open Date</TableCell>
                                    <TableCell>Close Date</TableCell>
                                    <TableCell>Borough</TableCell>
                                    <TableCell>City</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {complaints
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((c, index) => (
                                        <TableRow key={`${c.complaint_type}-${index}`}>
                                            <TableCell>{c.complaint_type}</TableCell>
                                            <TableCell>{c.descriptor}</TableCell>
                                            <TableCell>{c.opendate}</TableCell>
                                            <TableCell>{c.closedate || '—'}</TableCell>
                                            <TableCell>{c.borough}</TableCell>
                                            <TableCell>{c.city}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>

                        <TablePagination
                            component="div"
                            count={complaints.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default Dashboard;
