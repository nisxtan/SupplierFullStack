import React, { useState, useEffect } from 'react';
import type { Supplier } from '../types';
import { api } from '../api/apiClient';
import { motion } from 'framer-motion';

interface Props {
  supplierId: string;
  userId: string;
  onBack: () => void;
  onUpdate: () => void;
}

export const SupplierDetail: React.FC<Props> = ({ supplierId, userId, onBack, onUpdate }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSupplier();
  }, [supplierId, userId]);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const data = await api.getSupplierById(supplierId, userId);
      setSupplier(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch supplier details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'submit' | 'approve' | 'reject') => {
    if (!supplier) return;
    
    if (action === 'reject' && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    
    if (action === 'reject' && !rejectReason.trim()) {
      setError('Rejection requires a non-empty reason.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      
      if (action === 'submit') {
        await api.submitSupplier(supplier.id, userId);
      } else if (action === 'approve') {
        await api.approveSupplier(supplier.id, userId);
      } else if (action === 'reject') {
        await api.rejectSupplier(supplier.id, userId, rejectReason);
      }
      
      onUpdate();
      await fetchSupplier();
      setShowRejectInput(false);
      setRejectReason('');
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  if (!supplier) {
    return (
      <div className="glass-panel">
        <p>Supplier not found.</p>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: '1rem' }}>Back</button>
      </div>
    );
  }

  const isCreator = supplier.createdBy === userId;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="detail-view"
    >
      <div className="glass-panel">
        <div className="top-bar">
          <h2>Supplier Details</h2>
          <button className="btn btn-secondary" onClick={onBack}>Back to List</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="detail-grid">
          <div className="detail-item">
            <label>Company Name</label>
            <p>{supplier.companyName}</p>
          </div>
          <div className="detail-item">
            <label>VAT ID</label>
            <p>{supplier.vatId}</p>
          </div>
          <div className="detail-item">
            <label>Country</label>
            <p>{supplier.country}</p>
          </div>
          <div className="detail-item">
            <label>Contact Email</label>
            <p>{supplier.contactEmail}</p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p>
              <span className={`badge ${supplier.status}`}>
                {supplier.status.replace('_', ' ')}
              </span>
            </p>
          </div>
          <div className="detail-item">
            <label>Created By</label>
            <p>{supplier.createdBy}</p>
          </div>
          {supplier.approvedBy && (
            <div className="detail-item">
              <label>Approved By</label>
              <p>{supplier.approvedBy}</p>
            </div>
          )}
          {supplier.rejectedBy && (
            <div className="detail-item">
              <label>Rejected By</label>
              <p>{supplier.rejectedBy}</p>
            </div>
          )}
          {supplier.rejectionReason && (
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <label>Rejection Reason</label>
              <p>{supplier.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar">
        <h3>Actions</h3>
        <div className="action-stack">
          {supplier.status === 'DRAFT' && (
            <button 
              className="btn btn-primary" 
              onClick={() => handleAction('submit')}
              disabled={actionLoading}
            >
              Submit for Approval
            </button>
          )}

          {supplier.status === 'PENDING_APPROVAL' && (
            <>
              {isCreator ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.5rem', background: 'var(--bg-base)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  You cannot approve or reject a supplier you created (four-eyes rule).
                </div>
              ) : (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                  
                  {!showRejectInput ? (
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleAction('reject')}
                      disabled={actionLoading}
                    >
                      Reject...
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}
                    >
                      <textarea 
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        rows={3}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => setShowRejectInput(false)} style={{ flex: 1 }}>Cancel</button>
                        <button className="btn btn-danger" onClick={() => handleAction('reject')} style={{ flex: 1 }} disabled={actionLoading}>Confirm</button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}

          {(supplier.status === 'APPROVED' || supplier.status === 'REJECTED') && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              This supplier is locked and cannot be modified.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
