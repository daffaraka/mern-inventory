import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import Input from '../common/Input';
import Button from '../common/Button';
import stockService from '../../services/stockService';
import productService from '../../services/productService';
import userService from '../../services/userService';

const MotionDiv = motion.div;

const schemaIn = yup.object({
  productId: yup.string().required('Product is required'),
  quantity: yup.number().typeError('Must be a number').positive().integer().required('Quantity is required'),
  reason: yup.string().required('Reason is required'),
  inputBy: yup.string().required('Input by is required'),
}).required();

const schemaOut = yup.object({
  productId: yup.string().required('Product is required'),
  quantity: yup.number().typeError('Must be a number').positive().integer().required('Quantity is required'),
  reason: yup.string().required('Reason is required'),
  inputBy: yup.string().required('Input by is required'),
  salesOrderNumber: yup.string().optional(),
}).required();

// Defined outside component to avoid re-creation on render
const SelectField = ({ label, name, error, children, registerFn }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      {...registerFn(name)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 focus:outline-none bg-white text-sm"
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
  </div>
);

const StockModal = ({ isOpen, onClose, type = 'IN', onSuccess }) => {
  const isStockIn = type === 'IN';
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(isStockIn ? schemaIn : schemaOut),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      const load = async () => {
        try {
          const [prodData, userData] = await Promise.all([
            productService.getAll(),
            userService.getAll(),
          ]);
          setProducts(prodData.products);
          setUsers(userData.users);
        } catch {
          toast.error('Failed to load data');
        }
      };
      load();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      if (isStockIn) {
        await stockService.stockIn(data);
        toast.success('Stock In request submitted');
      } else {
        await stockService.stockOut(data);
        toast.success('Stock Out request submitted');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
          />
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isStockIn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isStockIn ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{isStockIn ? 'Stock In' : 'Stock Out'}</h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">


                <SelectField label="Category" name="category" error={errors.category} registerFn={register}>
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Product" name="productId" error={errors.productId} registerFn={register}>
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </SelectField>

                <Input
                  label="Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  error={errors.quantity}
                  {...register('quantity')}
                />

                <Input
                  label="Reason"
                  placeholder={isStockIn ? 'e.g. New Shipment' : 'e.g. Sales Order'}
                  error={errors.reason}
                  {...register('reason')}
                />

                {!isStockIn && (
                  <Input
                    label="Sales Order Number (optional)"
                    placeholder="e.g. SO-2024-001"
                    error={errors.salesOrderNumber}
                    {...register('salesOrderNumber')}
                  />
                )}

                <SelectField label="Input By (Nama & Role)" name="inputBy" error={errors.inputBy} registerFn={register}>
                  <option value="">-- Select User --</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {u.role}
                    </option>
                  ))}
                </SelectField>

                <div className={`text-xs rounded-xl px-4 py-3 ${isStockIn ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {isStockIn
                    ? 'Request will be sent to Finance for approval, then Management for acknowledgement.'
                    : 'Request will be sent to Management for approval, then Finance for acknowledgement.'}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className={isStockIn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default StockModal;
