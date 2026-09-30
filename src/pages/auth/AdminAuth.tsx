import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminAuth: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const { t, lang } = useI18n();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('admin@eyewear-marketplace.demo');
  const [password, setPassword] = useState('demo123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, 'admin');
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.message || 'Identifiants administrateur invalides.');
    }
  };

  const handleQuickDemo = () => {
    loginAsDemo('admin');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 max-w-md w-full shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            {t('adminPortal')}
          </span>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Administration Centrale
          </h1>
          <p className="text-xs text-neutral-500">
            Console de modération, validation des boutiques et gestion des commissions.
          </p>
        </div>

        {/* Quick Demo Button */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-center text-neutral-600">
            <span className="font-semibold text-neutral-900">Compte administrateur :</span>
            <span className="font-mono text-[11px]">admin@eyewear-marketplace.demo</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('useAdminDemo')}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-medium mb-1">Email administrateur *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-medium mb-1">Mot de passe *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Accéder à la console</span>
            {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-[11px] text-neutral-400 text-center">
          Note de sécurité : L'inscription publique des administrateurs est désactivée conformément au cahier des charges.
        </p>
      </div>
    </div>
  );
};
