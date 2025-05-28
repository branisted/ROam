import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check session from backend
    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/auth/session", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchSession();
    }, []);

    // Login: POST to backend, then update state
    const login = async (loginData) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(loginData)
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            return { success: true };
        } else {
            const err = await res.json();
            return { success: false, message: err.message };
        }
    };

    // Logout: POST to backend, then clear state
    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}