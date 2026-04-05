import React from 'react';
import { X, CheckCircle, Eye, XCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
import { toast } from 'react-hot-toast';
import stockService from '../../services/stockService';

const STATUS_STYLES = {
  pending:      'bg-amber-100 text-amber-700',
  approved:     'bg-blue-100 text-blue-700',
  acknowledged: 'bg-green-100 text-green-700',
  rejected:     'bg-red-100 text-red-700',
};

const StockActionModal = ({ item, userRole, onClose, onSuccess }) => {
  if (!item) return null;

  const isAdmin   = userRole === 'admin';
  const { status, type } = item;

  // Determine available actions
  const actions = [];
  if (type === 'IN') {
    if (status === 'pending' && (userRole === 'finance' || isAdmin)) {
      actions.push({ key: 'approve-in',  label: 'Approve',     color: 'blue',  icon: CheckCircle });
      actions.push({ key: 'reject',      label: 'Reject',      color: 'red',   icon: XCircle });
    }
    if (status === 'approved' && (userRole === 'management' || isAdmin)) {
      actions.push({ key: 'ack-in',      label: 'Acknowledge', color: 'green', icon: Eye });
    }
  }
  if (type === 'OUT') {
    if (status === 'pending' && (userRole === 'management' || isAdmin)) {
      actions.push({ key: 'approve-out', label: 'Approve',     color: 'blue',  icon: CheckCircle });
      actions.push({ key: 'reject',      label: 'Reject',      color: 'red',   icon: XCircle });
    }
    if (status === 'approved' && (userRole === 'finance' || isAdmin)) {
      actions.push({ key: 'ack-out',     label: 'Acknowledge', color: 'green', icon: Eye });
    }
  }

  const handleAction = async (actionKey) => {
    try {
      if (actionKey === 'approve-in')       await stockService.approveStockIn(item._id);
      else if (actionKey === 'ack-in')      await stockService.acknowledgeStockIn(item._id);
      else if (actionKey === 'approve-out') await stockService.approveStockOut(item._id);
      else if (actionKey === 'ack-out')     await stockService.acknowledgeStockOut(item._id);
      else if (actionKey === 'reject')      await stockService.reject(item._id);
      toast.success('Action successful');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const btnColor = {
    blue:  'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    red:   'bg-red-100 hover:bg-red-200 text-red-700',
  };

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {type === 'IN' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{item.product?.name || 'Unknown Product'}</p>
                <p className="text-xs text-gray-500">Stock {type} · Qty: {item.quantity}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
              <X size={18} />
            </button>
          </div>

          {/* Detail */}
          <div className="px-5 py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
                {status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Submitted by</span>
              <span className="font-medium text-gray-800">{item.user?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reason</span>
              <span className="font-medium text-gray-800">{item.reason || '—'}</span>
            </div>
            {item.salesOrderNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">Sales Order</span>
                <span className="font-mono font-medium text-gray-800">{item.salesOrderNumber}</span>
              </div>
            )}
            {item.approvedBy && (
              <div className="flex justify-between">
                <span className="text-gray-500">Approved by</span>
                <span className="font-medium text-gray-800">{item.approvedBy?.name}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-5 pb-5">
            {actions.length > 0 ? (
              <div className="flex gap-3">
                {actions.map(a => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.key}
                      onClick={() => handleAction(a.key)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${btnColor[a.color]}`}
                    >
                      <Icon size={16} /> {a.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400 py-2">No actions available for your role.</p>
            )}
          </div>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
};

export default StockActionModal;
