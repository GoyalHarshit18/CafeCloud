const API_URL = 'http://localhost:5000/api';

export const authApi = {
    register: async (userData: any) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        return data;
    },

    login: async (credentials: any) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    },

    verifySignup: async (verifyData: { email: string; otp: string }) => {
        const response = await fetch(`${API_URL}/auth/verify-signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Verification failed');
        }
        return data;
    },

    verifyLogin: async (verifyData: { email: string; otp: string }) => {
        const response = await fetch(`${API_URL}/auth/verify-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login verification failed');
        }
        return data;
    },
};
