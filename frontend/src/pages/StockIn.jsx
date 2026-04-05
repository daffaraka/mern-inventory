import React, { useState } from 'react';
import StockModal from '../components/stock/StockModal';
import StockPages from './StockPages';
import Button from '../components/common/Button';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StockIn = () => {
    const { user } = useAuth();
    const canInput = ['staff', 'admin'].includes(user?.role);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp size={24} />
                        </span>
                        Stock In
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {user?.role === 'admin'
                            ? 'Full access: input, approve, and acknowledge Stock In requests.'
                            : canInput
                            ? 'Submit a new stock entry request.'
                            : user?.role === 'finance'
                                ? 'Review and approve pending Stock In requests below.'
                                : 'Acknowledge approved Stock In requests below.'}
                    </p>
                </div>
                {canInput && (
                    <Button onClick={() => setIsOpen(true)} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                        <TrendingUp size={18} /> New Stock In
                    </Button>
                )}
            </div>

            {/* Approval flow info */}
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm w-fit">
                <FlowStep label="Staff" sub="Input"       active={canInput && user?.role !== 'admin'} adminActive={user?.role === 'admin'} />
                <Arrow />
                <FlowStep label="Finance" sub="Approve"   active={user?.role === 'finance'} adminActive={user?.role === 'admin'} />
                <Arrow />
                <FlowStep label="Management" sub="Acknowledge" active={user?.role === 'management'} adminActive={user?.role === 'admin'} />
            </div>

            <StockPages type="IN" />

            <StockModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                type="IN"
                onSuccess={() => { setIsOpen(false); window.location.reload(); }}
            />
        </div>
    );
};

const FlowStep = ({ label, sub, active, adminActive }) => (
    <div className={`flex flex-col items-center px-3 py-1 rounded-lg ${adminActive ? 'bg-purple-50' : active ? 'bg-brand-50' : ''}`}>
        <span className={`font-semibold text-xs ${adminActive ? 'text-purple-700' : active ? 'text-brand-700' : 'text-gray-700'}`}>{label}</span>
        <span className={`text-xs ${adminActive ? 'text-purple-500' : active ? 'text-brand-500' : 'text-gray-400'}`}>{sub}</span>
    </div>
);

const Arrow = () => <span className="text-gray-300 font-bold">→</span>;

export default StockIn;
