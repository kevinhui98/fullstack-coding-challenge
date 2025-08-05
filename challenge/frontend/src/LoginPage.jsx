import React, { useState } from "react";
import axios from "axios";

const LoginPage = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("try")
            const response = await axios.post("http://localhost:8000/login/", {
                username,
                password,
            });

            const token = response.data.token;
            setToken(token);

            console.log("Login successful. Token:", token);

            // Redirect or call a protected API
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
