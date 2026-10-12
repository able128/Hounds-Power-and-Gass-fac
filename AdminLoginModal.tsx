import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, X, ArrowRight, KeyRound, Eye, EyeOff } from 'lucide-react';
import { COMPANY_NAME } from '../data/mockData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict admin password required by user: @3in1@
    if (password === '@3in1@') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-8 shadow-2xl text-slate-100 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Administrator Verification
          </h2>
          <p className="text-xs text-slate-400">
            Confidential access to {COMPANY_NAME} customer signups and persistent database records.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminPassword" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Enter Admin Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password..."
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border ${
                  error ? 'border-rose-500 bg-rose-950/20 text-rose-200' : 'border-slate-700 text-white focus:border-amber-400'
                } text-sm focus:outline-hidden transition-colors font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-rose-400 text-xs mt-2 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                Access denied: Incorrect administrative password.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Unlock Admin Dashboard</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>
        <div className="pt-2 text-center text-[10px] text-slate-500">
          Authorized personnel only. All access attempts are monitored and recorded.
        </div>
      </div>
    </div>
  );
};
