import React from 'react';
import type { Supplier } from '../types';
import { motion } from 'framer-motion';

interface Props {
  suppliers: Supplier[];
  onSelect: (id: string) => void;
}

export const SupplierList: React.FC<Props> = ({ suppliers, onSelect }) => {
  if (suppliers.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <p>No suppliers found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>VAT ID</th>
              <th>Status</th>
              <th>Creator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <motion.tr 
                key={supplier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td>{supplier.companyName}</td>
                <td>{supplier.vatId}</td>
                <td>
                  <span className={`badge ${supplier.status}`}>
                    {supplier.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{supplier.createdBy}</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onSelect(supplier.id)}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
