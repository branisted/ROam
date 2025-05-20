import { Link } from 'react-router-dom';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check login state on mount and when localStorage changes
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    // Optional: Listen to storage events for cross-tab sync
    useEffect(() => {
        const syncUser = () => {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener("storage", syncUser);
        return () => window.removeEventListener("storage", syncUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav style={{ padding: '1rem', background: '#eee' }}>

            {/* Always show Home */}
            <Link to="/">Home</Link> |{' '}
            <Link to="/">Posts</Link> |{' '}

            {/* Show Register and Log in if NOT logged in */}
            {!user && (
                <>
                    <Link to="/register">Register</Link> |{' '}
                    <Link to="/login">Login</Link>
                </>
            )}

            {/* Show Log out if logged in */}
            {user && (
                <>
                <Link to="/add-post">Add Post</Link> |{' '}
                <button onClick={handleLogout}>Log out</button>
                </>
            )}

        </nav>
    );
}

export default Navbar;