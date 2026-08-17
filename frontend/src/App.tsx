import React, { useState, useEffect } from 'react';
import type { Supplier } from './types';
import { api } from './api/apiClient';
import { SupplierList } from './components/SupplierList';
import { SupplierForm } from './components/SupplierForm';
import { SupplierDetail } from './components/SupplierDetail';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [userId, setUserId] = useState<string>('Anna');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.getSuppliers(userId);
      setSuppliers(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [userId]);

  return (
    <div className="app-container">
      <header>
        <h1>Supplier Manager</h1>
        <div className="user-selector">
          <label htmlFor="user-select">Logged in as:</label>
          <select 
            id="user-select" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="Anna">Anna (Requester)</option>
            <option value="Max">Max (Approver)</option>
          </select>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="top-bar">
                <h2>All Suppliers</h2>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setView('create')}
                >
                  <Plus size={18} />
                  New Supplier
                </button>
              </div>

              {error && <div className="error-banner">{error}</div>}
              
              {loading ? (
                <div className="loading"><div className="spinner" /></div>
              ) : (
                <SupplierList 
                  suppliers={suppliers} 
                  onSelect={(id) => {
                    setSelectedId(id);
                    setView('detail');
                  }} 
                />
              )}
            </motion.div>
          )}

          {view === 'create' && (
            <SupplierForm 
              key="create"
              userId={userId}
              onSuccess={() => {
                setView('list');
                fetchSuppliers();
              }}
              onCancel={() => setView('list')}
            />
          )}

          {view === 'detail' && selectedId && (
            <SupplierDetail 
              key="detail"
              supplierId={selectedId}
              userId={userId}
              onBack={() => setView('list')}
              onUpdate={() => fetchSuppliers()}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
