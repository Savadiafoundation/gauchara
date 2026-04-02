import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: any): string {
  if (!path) return '';

  // If we mistakenly got an object (like a DRF FileField object or similar)
  if (typeof path === 'object' && path !== null) {
    // Try common nested URL fields
    const nestedPath = path.url || path.file || path.path || path.uri;
    if (nestedPath && typeof nestedPath === 'string') {
      return getImageUrl(nestedPath);
    }
    console.warn('getImageUrl received non-string path object:', path);
    return '';
  }

  if (typeof path !== 'string') {
    return '';
  }

  // Handle nested/encoded URLs (common when backend prefixes external URLs with its own media path)
  if (path.includes('/media/http%3A') || path.includes('/media/https%3A') || path.includes('media/http%3A') || path.includes('media/https%3A')) {
    const parts = path.split('/media/');
    if (parts.length > 1) {
      try {
        let decoded = decodeURIComponent(parts[1]);
        // Fix for missing double slash after protocol (e.g. "https:/" -> "https://")
        if (decoded.startsWith('https:/') && !decoded.startsWith('https://')) {
          decoded = decoded.replace('https:/', 'https://');
        } else if (decoded.startsWith('http:/') && !decoded.startsWith('http://')) {
          decoded = decoded.replace('http:/', 'http://');
        }

        if (decoded.startsWith('http')) return decoded;
      } catch (e) {
        console.error('Failed to decode nested image URL:', path);
      }
    }
  }

  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:') || path.startsWith('//')) {
    return path;
  }

  // Get API URL from env or default - must match axios.ts
  const apiUrl = import.meta.env.VITE_API_URL || 'https://gauchara-8368.onrender.com/api';

  // Remove /api from the end to get base URL
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const finalUrl = `${baseUrl}${cleanPath}`;

  // Only log in development or if explicitly needed
  if (import.meta.env.DEV) {
    console.log(`getImageUrl [Origin: ${window.location.origin}]: ${path} -> ${finalUrl}`);
  }

  return finalUrl;
}
