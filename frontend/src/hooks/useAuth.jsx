import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: check for stored user (either mock or real)
    useEffect(() => {
        // First check for mock user (for testing UI)
        const mockUser = localStorage.getItem('user');
        if (mockUser) {
            setUser(JSON.parse(mockUser));
            setLoading(false);
            return;
        }

        // Then check for real credentials
        const creds = localStorage.getItem('basicAuth');
        if (creds) {
            fetch('/admin/profile', {
                headers: { Authorization: `Basic ${creds}` },
                credentials: 'include'
            })
                .then(res => {
                    if (!res.ok) throw new Error('Not logged in');
                    return res.json();
                })
                .then(profile => {
                    setUser(profile);
                    localStorage.setItem('familyId', profile.familyId);
                })
                .catch(() => {
                    localStorage.removeItem('basicAuth');
                    localStorage.removeItem('familyId');
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
            headers: { Authorization: `Basic ${creds}` },
            credentials: 'include'
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
    const signup = ({ familyId, username, email, password, role }) => {
        console.log('Signup data before send:', { familyId, username, email, password, role });
        
        return fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                familyId, 
                username, 
                email, 
                password,
                role 
            }),
            credentials: 'include'
        })
            .then(res => {
                console.log('Signup response status:', res.status);
                
                // Check for specific error message in header
                const errorHeader = res.headers.get('X-Error-Message');
                if (!res.ok) {
                    if (errorHeader) {
                        throw new Error(errorHeader);
                    }
                    
                    // If no specific error header, try to parse error from body
                    return res.text().then(text => {
                        let errorMessage;
                        try {
                            // Try to parse as JSON if possible
                            const errorJson = JSON.parse(text);
                            errorMessage = errorJson.message || errorJson.error || text;
                        } catch (e) {
                            // If not JSON, use text as is
                            errorMessage = text || res.statusText;
                        }
                        
                        // If empty response, use status code
                        if (!errorMessage) {
                            if (res.status === 400) errorMessage = "Bad request - check your form data";
                            else if (res.status === 401) errorMessage = "Unauthorized - please login again";
                            else if (res.status === 403) errorMessage = "Forbidden - you don't have permission";
                            else if (res.status === 404) errorMessage = "Not found";
                            else if (res.status === 409) errorMessage = "Username or email already exists";
                            else if (res.status === 500) errorMessage = "Server error - please try again later";
                            else errorMessage = `Error: HTTP ${res.status}`;
                        }
                        
                        console.error('Signup error response:', errorMessage);
                        throw new Error(`Signup failed: ${errorMessage}`);
                    });
                }
                return res.json();
            })
            .then(newUser => {
                console.log('Signup successful, user:', newUser);
                // After signup, log in automatically
                return login({ username, password });
            })
            .catch(error => {
                console.error('Signup process error:', error);
                throw error;
            });
    };

    const logout = () => {
        localStorage.removeItem('basicAuth');
        localStorage.removeItem('familyId');
        localStorage.removeItem('user'); // Clear mock user too
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
