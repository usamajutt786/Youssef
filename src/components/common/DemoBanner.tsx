import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Role } from '../../types';
import { RotateCcw, Shield, Store as StoreIcon, User as UserIcon, Globe, Check } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentUser, loginAsDemo, logout } = useAuth();
  const { resetAllDemoData } = useMarketplace();
  const { lang, setLang, t } = useI18n();
  const { navigate, path } = useRouter();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleRoleSwitch = (role: Role, sellerIndex = 0) => {
    loginAsDemo(role, sellerIndex);
    if (role === 'customer') {
      navigate('/customer/dashboard');
    } else if (role === 'seller') {
      navigate('/seller/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const handleReset = () => {
    resetAllDemoData();
    setShowResetConfirm(false);
  };

  return (
    <>
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 border-b border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Interactive Demo Identity & Portal Jump */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
              {t('demoModeBadge')}
            </span>
            <span className="text-neutral-500 hidden sm:inline">|</span>
            <span className="text-neutral-400 hidden md:inline">
              {t('demoNotice')}
            </span>
          </div>

          {/* Center/Right: Quick Persona Switcher */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-neutral-500 text-[11px] hidden lg:inline">{t('switchRole')}:</span>
            
            {/* Customer Button */}
            <button
              onClick={() => handleRoleSwitch('customer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'customer'
                  ? 'bg-neutral-700 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Amina Benali (Client)"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Amina ({t('roleCustomer')})</span>
            </button>

            {/* Seller 1 Button */}
            <button
              onClick={() => handleRoleSwitch('seller', 0)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'seller' && currentUser.sellerStoreId === 'store-1'
                  ? 'bg-neutral-700 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Karim Alami (Atelier Optique)"
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span>Atelier Optique ({t('roleSeller')})</span>
            </button>

            {/* Seller 2 Button */}
            <button
              onClick={() => handleRoleSwitch('seller', 1)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'seller' && currentUser.sellerStoreId === 'store-2'
                  ? 'bg-neutral-700 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Sofia Mansouri (Luxe Vision)"
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Luxe Vision</span>
              <span className="sm:hidden">S2</span>
            </button>

            {/* Admin Button */}
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-600 text-white font-medium shadow-xs'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-neutral-800'
              }`}
              title="Youssef (Administrateur)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('roleAdmin')}</span>
            </button>

            <span className="text-neutral-600 hidden sm:inline">|</span>

            {/* Language Toggle */}
            <div className="flex items-center bg-neutral-800 rounded p-0.5">
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  lang === 'fr' ? 'bg-neutral-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  lang === 'ar' ? 'bg-neutral-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                العربية
              </button>
            </div>

            {/* Reset Demo */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 text-neutral-400 hover:text-red-400 px-2 py-1 rounded transition-colors hover:bg-neutral-800"
              title={t('resetDemo')}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden xl:inline">{t('resetDemo')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white text-neutral-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-neutral-200">
            <h3 className="text-lg font-semibold mb-2">{t('resetDemo')}</h3>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              {t('resetConfirm')}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('resetDemo')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
