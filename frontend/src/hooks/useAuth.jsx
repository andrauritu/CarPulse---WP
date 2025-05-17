import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: if we have Basic creds in localStorage, try to fetch profile
    useEffect(() => {
        const creds = localStorage.getItem('basicAuth');
        if (creds) {
            fetch('/admin/profile', {
                headers: { Authorization: `Basic ${creds}` }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Not logged in');
                    return res.json();
                })
                .then(profile => {
                    setUser(profile);
                })
                .catch(() => {
                    localStorage.removeItem('basicAuth');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // login via HTTP Basic, using "username" (not email!)
    const login = ({ username, password }) => {
        const creds = btoa(`${username}:${password}`);
        localStorage.setItem('basicAuth', creds);

        return fetch('/admin/profile', {
            headers: { Authorization: `Basic ${creds}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Invalid credentials');
                return res.json();
            })
            .then(profile => {
                setUser(profile);
                localStorage.setItem('familyId', profile.familyId);
                return profile;
            });
    };

    // signup → then immediately login with the same username/password
    const signup = ({ familyId, username, email, password, role }) =>
        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ familyId, username, email, password, role })
        })
            .then(res => {
                if (!res.ok) throw new Error('Signup failed');
            })
            .then(() => login({ username, password }));

    const logout = () => {
        localStorage.removeItem('basicAuth');
        localStorage.removeItem('familyId');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}
