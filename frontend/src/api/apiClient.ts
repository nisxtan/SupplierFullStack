import axios from 'axios';
import type { Supplier } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/suppliers';

const axiosWithUser = async (config: any, userId: string) => {
  try {
    const response = await axios({
      ...config,
      headers: {
        ...config.headers,
        'X-User-Id': userId,
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'API request failed');
  }
};

export const api = {
  getSuppliers: (userId: string): Promise<Supplier[]> => 
    axiosWithUser({ method: 'GET', url: API_URL }, userId),
  
  getSupplierById: (id: string, userId: string): Promise<Supplier> => 
    axiosWithUser({ method: 'GET', url: `${API_URL}/${id}` }, userId),
  
  createSupplier: (data: Partial<Supplier>, userId: string): Promise<Supplier> => 
    axiosWithUser({ method: 'POST', url: API_URL, data }, userId),
    
  submitSupplier: (id: string, userId: string): Promise<Supplier> => 
    axiosWithUser({ method: 'POST', url: `${API_URL}/${id}/submit` }, userId),
    
  approveSupplier: (id: string, userId: string): Promise<Supplier> => 
    axiosWithUser({ method: 'POST', url: `${API_URL}/${id}/approve` }, userId),
    
  rejectSupplier: (id: string, userId: string, reason: string): Promise<Supplier> => 
    axiosWithUser({ method: 'POST', url: `${API_URL}/${id}/reject`, data: { reason } }, userId),
};
