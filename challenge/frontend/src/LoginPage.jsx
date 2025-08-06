// import React, { useState } from "react";
// import axios from "axios";

// const LoginPage = ({ setToken, setUser }) => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         try {
//             console.log("try")
//             const response = await axios.post("http://localhost:8000/login/", {
//                 username,
//                 password,
//             });

//             const token = response.data.token;
//             setToken(token);
//             setUser(username);
//             console.log("user ", username)
//             console.log("Login successful. Token:", token);

//             // Redirect or call a protected API
//         } catch (err) {
//             console.error("Login error:", err);
//             setError("Invalid username or password.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <div>
//                     <label>Username:</label>
//                     <input
//                         required
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         type="text"
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         type="password"
//                     />
//                 </div>
//                 <button type="submit" disabled={loading}>
//                     {loading ? "Logging in..." : "Login"}
//                 </button>
//                 {error && <p style={{ color: "red" }}>{error}</p>}
//             </form>
//         </div>
//     );
// };

// export default LoginPage;
import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Paper,
} from "@mui/material";
import Header from "./components/Header";

const LoginPage = ({ setToken, setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/login/", {
                username,
                password,
            });

            const token = response.data.token;
            setToken(token);
            setUser(username);
            console.log("Login successful. Token:", token);
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header name={"New York City Council"} />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    pt: 15
                }}
            >
                <Container maxWidth="sm" >
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h4" gutterBottom align="center">
                            Login
                        </Typography>

                        <form onSubmit={handleLogin}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    required
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    required
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />

                                {error && <Alert severity="error">{error}</Alert>}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                    sx={{
                                        height: 45,
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default LoginPage;
