import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gauchara-8368.onrender.com/api';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://192.168.0.249:8000/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
});
   
// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if we have a refresh token before attempting to refresh
            const hasRefreshToken = !!localStorage.getItem('refresh_token');

            if (!hasRefreshToken) {
                // If no refresh token, we can't refresh. 
                // Just reject the error (let the component handle it or redirect if needed)
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                // No refresh token available, logout user
                localStorage.removeItem('admin_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin-login';
                return Promise.reject(error);
            }

            try {
                // Call refresh token endpoint
                const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Store new access token
                localStorage.setItem('admin_token', access);

                // Update authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                }

                // Process queued requests
                processQueue(null, access);

                // Retry original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh token failed, logout user
                processQueue(refreshError as AxiosError, null);
                localStorage.removeItem('admin_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin-login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other errors
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            const data = error.response.data as any;

            // Extract message from various common backend response formats
            if (data?.detail) {
                errorMessage = data.detail;
            } else if (data?.error) {
                errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            } else if (data?.errors) {
                // If there's an 'errors' plural key, it might be a list or object
                if (Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(', ');
                } else if (typeof data.errors === 'object') {
                    errorMessage = Object.entries(data.errors)
                        .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
                        .join(' | ');
                } else {
                    errorMessage = data.errors;
                }
            } else if (data?.message) {
                errorMessage = data.message;
            } else if (data?.non_field_errors) {
                errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors.join(', ') : data.non_field_errors;
            } else if (typeof data === 'string') {
                errorMessage = data;
            } else if (Array.isArray(data)) {
                errorMessage = data.map(item => 
                    typeof item === 'string' ? item : (item?.message || item?.detail || JSON.stringify(item))
                ).join(', ');
            } else if (typeof data === 'object' && data !== null) {
                // For validation errors, extract multiple field errors
                const fieldErrors = Object.entries(data)
                    .map(([field, msg]) => {
                        let message = '';
                        if (Array.isArray(msg)) {
                            message = msg.map(m => typeof m === 'object' ? JSON.stringify(m) : m).join(', ');
                        } else if (typeof msg === 'object' && msg !== null) {
                            message = JSON.stringify(msg);
                        } else {
                            message = String(msg);
                        }
                        
                        // Don't show the field name if it's 'detail' or 'error' as it's redundant
                        if (field === 'detail' || field === 'error' || field === 'message') return message;
                        return `${field}: ${message}`;
                    });
                
                if (fieldErrors.length > 0) {
                    errorMessage = fieldErrors.join(' | ');
                }
            }
        } else if (error.request) {
            errorMessage = 'No response received from server. Please check your connection.';
        } else {
            errorMessage = error.message;
        }

        // Attach the extracted message to the error object for components to use
        (error as any).backendError = errorMessage;

        if (error.response?.status === 403) {
            console.error('Access forbidden:', errorMessage);
        } else if (error.response?.status === 404) {
            console.error('Resource not found:', error.config?.url);
        } else if (error.response?.status >= 500) {
            console.error('Server error:', errorMessage);
        } else {
            console.error('API Error:', errorMessage);
        }

        return Promise.reject(error);
    }
);

// Utility function to manually refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('admin_token', access);
        return access;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('refresh_token');
        return null;
    }
};

// Utility function to clear tokens and logout
export const clearAuthTokens = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('refresh_token');
};

export default axiosInstance;
