import React from 'react';
import { Typography, Button, Box, AppBar, Toolbar, Container } from '@mui/material';

const Header = ({ name, onLogout, user }) => {
    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Container maxWidth="xl">
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        py: 1,
                    }}
                >
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        {name}
                    </Typography>
                    {/* <Typography variant="body2" sx={{ mb: 2 }}>
                        Your token: {token}
                    </Typography> */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            {user}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="inherit"
                            size="small"
                            onClick={onLogout}
                            sx={{
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // light transparent white
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
