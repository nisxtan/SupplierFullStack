import React, { useState } from 'react';
import type { Supplier } from '../types';
import { api } from '../api/apiClient';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface Props {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const SupplierForm: React.FC<Props> = ({ userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    companyName: '',
    vatId: '',
    country: '',
    contactEmail: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createSupplier(formData, userId);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-panel"
    >
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Create New Supplier</h2>
      
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input 
            type="text" 
            name="companyName" 
            value={formData.companyName} 
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            required 
          />
        </div>

        <div className="form-group">
          <label>VAT ID</label>
          <input 
            type="text" 
            name="vatId" 
            value={formData.vatId} 
            onChange={handleChange}
            placeholder="e.g. VAT12345"
            required 
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input 
            type="text" 
            name="country" 
            value={formData.country} 
            onChange={handleChange}
            placeholder="e.g. USA"
            required 
          />
        </div>

        <div className="form-group">
          <label>Contact Email</label>
          <input 
            type="email" 
            name="contactEmail" 
            value={formData.contactEmail} 
            onChange={handleChange}
            placeholder="e.g. contact@acme.com"
            required 
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" style={{width: 16, height: 16}}/> : 'Create Supplier'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
