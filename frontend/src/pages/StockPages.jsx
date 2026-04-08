import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpCircle, ArrowDownCircle, CheckCircle, Eye, XCircle, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { motion as MotionDiv } from 'framer-motion';
const Backdrop = MotionDiv.div;
const ModalBox = MotionDiv.div;
import stockService from '../services/stockService';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  acknowledged: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

// Confirmation dialog config per action
const ACTION_CONFIG = {
  'approve-in': { label: 'Approve', color: 'blue', icon: CheckCircle, message: 'Approve this Request Stock In request? Stock will be added to inventory.' },
  'approve-out': { label: 'Approve', color: 'blue', icon: CheckCircle, message: 'Approve this Request Stock Out request? Stock will be deducted from inventory.' },
  'ack-in': { label: 'Acknowledge', color: 'green', icon: Eye, message: 'Acknowledge this Request Stock In? This confirms you have reviewed the approval.' },
  'ack-out': { label: 'Acknowledge', color: 'green', icon: Eye, message: 'Acknowledge this Request Stock Out? This confirms you have reviewed the approval.' },
  'reject': { label: 'Reject', color: 'red', icon: XCircle, message: 'Reject this request? This action cannot be undone.' },
};

// ConfirmDialog component
const ConfirmDialog = ({ open, config, onConfirm, onCancel }) => {
  if (!config) return null;
  const Icon = config.icon;
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', btn: 'bg-green-600 hover:bg-green-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', btn: 'bg-red-600 hover:bg-red-700' },
  };
  const c = colorMap[config.color];

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
            onClick={onCancel}
          />
          <ModalBox
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm pointer-events-auto p-6 space-y-4">
              <div className={`w-12 h-12 rounded-full ${c.bg} flex items-center justify-center mx-auto`}>
                <Icon size={24} className={c.icon} />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-gray-900">Confirm {config.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{config.message}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${c.btn}`}
                >
                  {config.label}
                </button>
              </div>
            </div>
          </ModalBox>
        </>
      )}
    </AnimatePresence>
  );
};

const CATEGORIES = ['Logistik Material', 'Learning Material', 'Office Asset'];
const STATUSES = ['pending', 'approved', 'acknowledged', 'rejected'];

const StockPages = ({ type }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await stockService.getHistory(type !== 'HISTORY' ? type : undefined);
      setHistory(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load stock history');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const requestAction = (action, id) => setConfirm({ action, id });

  // Apply client-side filters
  const filteredHistory = history.filter((item) => {
    const itemDate = new Date(item.createdAt);
    if (dateFrom && itemDate < new Date(dateFrom)) return false;
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (itemDate > to) return false;
    }
    if (filterCategory && item.product?.category !== filterCategory) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  const handleConfirm = async () => {
    const { action, id } = confirm;
    setConfirm(null);
    try {
      if (action === 'approve-in') await stockService.approveStockIn(id);
      else if (action === 'ack-in') await stockService.acknowledgeStockIn(id);
      else if (action === 'approve-out') await stockService.approveStockOut(id);
      else if (action === 'ack-out') await stockService.acknowledgeStockOut(id);
      else if (action === 'reject') await stockService.reject(id);
      toast.success(`${ACTION_CONFIG[action].label} successful`);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const getActionButton = (item) => {
    const role = user?.role;
    const isAdmin = role === 'admin';
    const { status, type: itemType, _id } = item;

    if (itemType === 'IN') {
      if (status === 'pending' && (role === 'finance' || isAdmin)) {
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => requestAction('approve-in', _id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <CheckCircle size={14} /> Approve
            </button>
            <button onClick={() => requestAction('reject', _id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
              <XCircle size={14} /> Reject
            </button>
          </div>
        );
      }
      if (status === 'approved' && (role === 'management' || isAdmin)) {
        return (
          <button onClick={() => requestAction('ack-in', _id)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Eye size={14} /> Acknowledge
          </button>
        );
      }
    }

    if (itemType === 'OUT') {
      if (status === 'pending' && (role === 'management' || isAdmin)) {
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => requestAction('approve-out', _id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <CheckCircle size={14} /> Approve
            </button>
            <button onClick={() => requestAction('reject', _id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
              <XCircle size={14} /> Reject
            </button>
          </div>
        );
      }
      if (status === 'approved' && (role === 'finance' || isAdmin)) {
        return (
          <button onClick={() => requestAction('ack-out', _id)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Eye size={14} /> Acknowledge
          </button>
        );
      }
    }

    return <span className="text-xs text-gray-400">—</span>;
  };

  return (
    <>
      <ConfirmDialog
        open={!!confirm}
        config={confirm ? ACTION_CONFIG[confirm.action] : null}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white min-w-[160px]"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white min-w-[140px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        {(dateFrom || dateTo || filterCategory || filterStatus) && (
          <button
            onClick={() => { setDateFrom(''); setDateTo(''); setFilterCategory(''); setFilterStatus(''); }}
            className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-200 transition-colors"
          >
            <Filter size={14} /> Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Product</th>
                {type === 'HISTORY' && <th className="px-6 py-4">Type</th>}
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Reason</th>
                {(type === 'IN' || type === 'HISTORY') && <th className="px-6 py-4">Approved By</th>}
                {(type === 'OUT' || type === 'HISTORY') && <th className="px-6 py-4">Sales Order No.</th>}
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-600" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">No records found.</td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.product?.name || 'Unknown'}</td>
                    {type === 'HISTORY' && (
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${item.type === 'IN' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {item.type === 'IN' ? <ArrowUpCircle size={12} /> : <ArrowDownCircle size={12} />}
                          {item.type}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.reason || '—'}</td>
                    {(type === 'IN' || type === 'HISTORY') && (
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.approvedBy?.name || '—'}
                      </td>
                    )}
                    
                    {(type === 'OUT' || type === 'HISTORY') && (
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        {item.type === 'OUT' ? (item.salesOrderNumber || '—') : '—'}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-500">{item.user?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getActionButton(item)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StockPages;
