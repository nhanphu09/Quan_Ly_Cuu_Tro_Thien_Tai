import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        // Here you would optimally verify the token with the backend
        // For simplicity, we just check if it exists in localStorage and assume role from it or another item
        if (token) {
            const role = localStorage.getItem('role');
            const username = localStorage.getItem('username');
            if (role && username) {
                setUser({ username, role });
            }
        }
    }, [token]);

    const login = (newToken, role, username) => {
        setToken(newToken);
        setUser({ role, username });
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
