// Example: Using Axios Interceptors with Token Refresh

import axiosInstance, { refreshAccessToken, clearAuthTokens } from '@/lib/axios';
import { blogApi, authApi, causeApi, testimonialApi } from '@/lib/api';

// ============================================
// Example 1: Basic API Call (Automatic Token Handling)
// ============================================
export const fetchBlogs = async () => {
    try {
        // Token is automatically added by request interceptor
        const response = await blogApi.getAll();
        return response.data;
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        throw error;
    }
};

// ============================================
// Example 2: Protected Route with Token Check
// ============================================
export const ProtectedComponent = () => {
    const navigate = (path: string) => window.location.href = path; // Mock navigate
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
        }
    }, []);

    // Your component code...
};

// ============================================
// Example 3: Proactive Token Refresh
// ============================================
// Refresh token before it expires (e.g., every 14 minutes if token expires in 15 minutes)
export const setupTokenRefreshInterval = () => {
    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

    const intervalId = setInterval(async () => {
        const token = await refreshAccessToken();
        if (!token) {
            clearInterval(intervalId);
            window.location.href = '/admin/login';
        }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
};

// ============================================
// Example 4: Login with Token Storage
// ============================================
export const loginExample = async (username: string, password: string) => {
    try {
        const response = await authApi.login({ username, password });

        // Store both tokens
        const accessToken = response.data.access || response.data.token;
        const refreshToken = response.data.refresh;

        if (accessToken) {
            localStorage.setItem('admin_token', accessToken);
        }

        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }

        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

// ============================================
// Example 5: Logout with Token Cleanup
// ============================================
export const logoutExample = async () => {
    try {
        // Call backend logout endpoint
        await authApi.logout();
    } catch (error) {
        console.error('Logout API failed:', error);
    } finally {
        // Always clear tokens locally
        clearAuthTokens();
        window.location.href = '/admin/login';
    }
};

// ============================================
// Example 6: Handling Multiple Simultaneous Requests
// ============================================
export const fetchMultipleResources = async () => {
    try {
        // All requests will use the same refreshed token
        // If token expires, only ONE refresh request will be made
        const [blogs, causes, testimonials] = await Promise.all([
            blogApi.getAll(),
            causeApi.getAll(),
            testimonialApi.getAll(),
        ]);

        return { blogs, causes, testimonials };
    } catch (error) {
        console.error('Failed to fetch resources:', error);
        throw error;
    }
};

// ============================================
// Example 7: Custom Error Handling
// ============================================
export const fetchWithCustomErrorHandling = async () => {
    try {
        const response = await blogApi.getAll();
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            // Token refresh already attempted by interceptor
            // If we're here, refresh failed
            console.log('Authentication failed, redirecting to login...');
        } else if (error.response?.status === 403) {
            console.log('Access forbidden');
        } else if (error.response?.status === 404) {
            console.log('Resource not found');
        } else {
            console.log('An error occurred:', error.message);
        }
        throw error;
    }
};

// ============================================
// Example 8: Using in React Component
// ============================================
import { useState, useEffect } from 'react';

export const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                setLoading(true);
                // Interceptor handles token automatically
                const response = await blogApi.getAll();
                setBlogs(response.data);
            } catch (err: any) {
                setError(err.message);
                // If 401 and refresh failed, user is already redirected
            } finally {
                setLoading(false);
            }
        };

        loadBlogs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {blogs.map((blog) => (
                <div key={blog.id}>{blog.title}</div>
            ))}
        </div>
    );
};

// ============================================
// Example 9: File Upload with Token
// ============================================
export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Token is automatically added by interceptor
        const response = await axiosInstance.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};

// ============================================
// Example 10: Checking Token Expiration
// ============================================
import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
};

export const checkAndRefreshToken = async () => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
        return false;
    }

    if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        return !!newToken;
    }

    return true;
};
