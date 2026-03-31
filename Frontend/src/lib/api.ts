import axiosInstance from './axios';

// Auth APIs
export const authApi = {
  forgotPassword: (email: string) => axiosInstance.post('/forgot-password/', { email }),
  login: (data: Record<string, unknown>) => axiosInstance.post('/login/', data),
  register: (data: Record<string, unknown>) => axiosInstance.post('/register/', data),
  resetPassword: (data: Record<string, unknown>) => axiosInstance.post('/reset-password/', data),
  adminLogin: (data: Record<string, unknown>) => axiosInstance.post('/login/', data),
  logout: () => axiosInstance.post('/logout/'),
};

// Blog APIs
export const blogApi = {
  getAll: () => axiosInstance.get('/blog/'),
  getById: (id: number | string) => axiosInstance.get(`/blog/${id}/`),
  getBySlug: (slug: string) => axiosInstance.get(`/blog/${slug}/`), // Keeping for compatibility, check if backend supports
  create: (data: FormData | any) => {
    return axiosInstance.post('/blog/', data);
  },
  update: (id: number | string, data: FormData | any) => {
    return axiosInstance.put(`/blog/${id}/`, data);
  },
  delete: (id: number | string) => axiosInstance.delete(`/blog/${id}/`),
};

// Cause APIs
export const causeApi = {
  getAll: () => axiosInstance.get('/cause/'),
  getById: (id: string) => axiosInstance.get(`/cause/${id}/`),
  create: (data: FormData | Record<string, unknown>) => {
    return axiosInstance.post('/cause/', data);
  },
  update: (id: string, data: FormData | Record<string, unknown>) => {
    return axiosInstance.put(`/cause/${id}/`, data);
  },
  delete: (id: string) => axiosInstance.delete(`/cause/${id}/`),
};

// Testimonial APIs
export const testimonialApi = {
  getAll: () => axiosInstance.get('/testimonial/'),
  getById: (id: string | number) => axiosInstance.get(`/testimonial/${id}/`),
  create: (data: FormData | Record<string, unknown>) => {
    return axiosInstance.post('/testimonial/', data);
  },
  update: (id: string | number, data: FormData | Record<string, unknown>) => {
    return axiosInstance.put(`/testimonial/${id}/`, data);
  },
  delete: (id: string) => axiosInstance.delete(`/testimonial/${id}/`),
};

// Donation APIs
export const donationApi = {
  create: (data: FormData | Record<string, unknown>) => {
    return axiosInstance.post('/donation1/', data);
  },
  getAll: () => axiosInstance.get('/donation2/'),
  updateStatus: (id: number | string, data: { payment_status: string }) => axiosInstance.patch(`/donation3/${id}/status/`, data),
  delete: (id: number | string) => axiosInstance.delete(`/donation3/${id}/`),
  verifyPayPal: (orderId: string) => axiosInstance.post('/donations/verify-paypal', { orderId }),
  uploadProof: async (donationId: string, file: File) => {
    const formData = new FormData();
    formData.append('proof', file);
    formData.append('donationId', donationId);

    return axiosInstance.post('/donations/upload-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  generateReference: () => axiosInstance.get('/donations/generate-reference'),
  createPaymentIntent: (data: Record<string, unknown>) => axiosInstance.post('/donations/create-payment-intent', data),
  confirmDonation: (data: Record<string, unknown>) => axiosInstance.post('/donations/confirm', data),
};

// Contact API
export const contactApi = {
  create: (data: Record<string, unknown>) => axiosInstance.post('/contact/', data),
  getAll: () => axiosInstance.get('/contact/'),
  delete: (id: number | string) => axiosInstance.delete(`/contact/${id}/`),
};

// Chatbot API
export const chatbotApi = {
  sendMessage: (message: string) => axiosInstance.post('/chat', { message }),
  getQuickReplies: () => axiosInstance.get('/chat/quick-replies'),
};

// Volunteer API
export const volunteerApi = {
  create: (data: Record<string, unknown>) => axiosInstance.post('/volunteer/', data),
  getAll: () => axiosInstance.get('/volunteer/'),
  getById: (id: number | string) => axiosInstance.get(`/volunteer/${id}/`),
  update: (id: number | string, data: Record<string, unknown>) => axiosInstance.put(`/volunteer/${id}/`, data),
  delete: (id: number | string) => axiosInstance.delete(`/volunteer/${id}/`),
};

// Gallery API
export const galleryApi = {
  create: (data: FormData) => axiosInstance.post('/gallery/', data),
  getAll: () => axiosInstance.get('/gallery/'),
  getById: (id: number | string) => axiosInstance.get(`/gallery/${id}/`),
  update: (id: number | string, data: FormData) => axiosInstance.put(`/gallery/${id}/`, data),
  delete: (id: number | string) => axiosInstance.delete(`/gallery/${id}/`),
};

// Category API
export const categoryApi = {
  create: (data: Record<string, unknown>) => axiosInstance.post('/category/', data),
  getAll: () => axiosInstance.get('/category/'),
  getById: (id: number | string) => axiosInstance.get(`/category/${id}/`),
  update: (id: number | string, data: Record<string, unknown>) => axiosInstance.put(`/category/${id}/`, data),
  delete: (id: number | string) => axiosInstance.delete(`/category/${id}/`),
};

// Cause Category API
export const causeCategoryApi = {
  create: (data: Record<string, unknown>) => axiosInstance.post('/category1/', data),
  getAll: () => axiosInstance.get('/category1/'),
  delete: (id: number | string) => axiosInstance.delete(`/category1/${id}/`),
};

// Program API
export const programApi = {
  getAll: () => axiosInstance.get('/program/'),
  getById: (id: string | number) => axiosInstance.get(`/program/${id}/`),
  create: (data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    return axiosInstance.post('/program/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
  },
  update: (id: string | number, data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    return axiosInstance.put(`/program/${id}/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
  },
  delete: (id: string | number) => axiosInstance.delete(`/program/${id}/`),
};

// Type definitions
export interface Blog {
  id: number;
  author: {
    username: string;
    email: string;
  };
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  created_at?: string;
}

export interface Cause {
  id: number;
  _id?: string | number;
  title: string;
  short_description: string;
  full_content: string;
  image: string | null;
  image_file: string | null;
  image_url: string | null;
  goal_amount: string | number;
  raised_amount?: string | number;
  category: string;
  featured: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

export interface DonationData {
  amount: number;
  currency: string;
  cause_id?: string;
  full_name: string;
  email: string;
  phone: string;
  // For Payment Gateways
  payment_method?: 'upi' | 'swift' | 'stripe' | 'paypal';
}

export interface DonationRecord {
  id: number;
  final_amount: string;
  full_name: string;
  email: string;
  whatsapp_number: string | null;
  pan_number: string | null;
  selected_amount: number | null;
  custom_amount: number | null;
  region: string;
  uploaded_receipt: string | null;
  payment_status: 'pending' | 'success' | 'failed';
  created_at: string;
}

export interface DonationResponse {
  id: string;
  referenceId: string;
  status: 'pending' | 'completed' | 'failed';
  paypalOrderId?: string;
}

export interface PayPalVerification {
  success: boolean;
  transactionId: string;
  status: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ChatbotResponse {
  message: string;
  suggestions?: string[];
}

export interface VolunteerApplication {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  address: string;
  occupation: string;
  availability: string;
  skills: string;
  reason: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  file_image: string | null;
  url_image: string | null;
}

