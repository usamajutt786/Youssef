import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { User, Lock, Mail, ArrowRight, ArrowLeft, ShieldAlert, Check } from 'lucide-react';

export const CustomerAuth: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { login, loginAsDemo, registerCustomer, simulatedResetPassword } = useAuth();
  const { t, lang } = useI18n();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('amina@example.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetMessage, setResetMessage] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, 'customer');
    if (res.success) {
      navigate('/customer/dashboard');
    } else {
      setErrorMsg(res.message || 'Identifiants invalides');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    const res = registerCustomer(name, email, phone);
    if (res.success) {
      navigate('/customer/dashboard');
    } else {
      setErrorMsg('Cet email est déjà utilisé.');
    }
  };

  const handleQuickDemo = () => {
    loginAsDemo('customer');
    navigate('/customer/dashboard');
  };

  const handleResetPassword = () => {
    if (!email) {
      setErrorMsg('Veuillez renseigner votre email d\'abord.');
      return;
    }
    const sent = simulatedResetPassword(email);
    if (sent) {
      setResetMessage(true);
      setTimeout(() => setResetMessage(false), 4000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 max-w-md w-full shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            {t('customerPortal')}
          </span>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {mode === 'login' ? t('loginTitle') : t('registerTitle')}
          </h1>
          <p className="text-xs text-neutral-500">
            Gérez vos commandes en paiement à la livraison et vos favoris.
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between items-center text-neutral-600">
            <span className="font-semibold text-neutral-900">Compte client démo :</span>
            <span className="font-mono text-[11px]">amina@example.com</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('useCustomerDemo')}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {resetMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            {t('simulatedResetLink')}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Nom complet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Amina Benali"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-medium mb-1">{t('email')} *</label>
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-neutral-700 font-medium">Mot de passe *</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-neutral-500 hover:text-neutral-900 text-[11px] underline"
                >
                  {t('forgotPassword')}
                </button>
              )}
            </div>
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

          {mode === 'register' && (
            <div>
              <label className="block text-neutral-700 font-medium mb-1">{t('phone')} *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+212 6..."
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            {mode === 'login' ? t('navLogin') : t('navRegister')}
          </button>
        </form>

        {/* Switch Login/Register */}
        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          {mode === 'login' ? (
            <p>
              {t('dontHaveAccount')}{' '}
              <button
                onClick={() => navigate('/customer/register')}
                className="text-neutral-900 font-semibold underline"
              >
                {t('navRegister')}
              </button>
            </p>
          ) : (
            <p>
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/customer/login')}
                className="text-neutral-900 font-semibold underline"
              >
                {t('navLogin')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
