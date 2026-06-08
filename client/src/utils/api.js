import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for transmission of HttpOnly JWT cookies
  timeout: 15000
});

// Response interceptor to catch rate-limiting and other global backend errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'ያልታወቀ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።'; // Unknown error, try again
    
    // Show user-friendly toast alerts for API failures
    if (error.response?.status === 429) {
      toast.error('ፈጣን ጥያቄዎችን አቁመዋል! በአንድ ደቂቃ 10 ጊዜ ብቻ መመርመር ይቻላል።');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const getImageUrl = (path) => {
  if (!path) return '/uploads/placeholder.jpg';
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverBase = apiBase.replace(/\/api\/?$/, ''); // Remove trailing '/api' or '/api/'
  return `${serverBase}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API;
