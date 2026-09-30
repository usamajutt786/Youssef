import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Glasses,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { currentUser, logout } = useAuth();
  const { cart, favorites, notifications } = useMarketplace();
  const { t, lang } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter(
    n => !n.isRead && (!currentUser || n.recipientRole === currentUser.role)
  ).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const getDashboardPath = () => {
    if (!currentUser) return '/customer/login';
    if (currentUser.role === 'customer') return '/customer/dashboard';
    if (currentUser.role === 'seller') return '/seller/dashboard';
    if (currentUser.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark (Display Font) */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
              Optique<span className="text-amber-600">.</span>
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-neutral-900 transition-colors relative py-1 ${
                path === '/' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              {t('navHome')}
              {path === '/' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>

            <button
              onClick={() => navigate('/catalog')}
              className={`hover:text-neutral-900 transition-colors relative py-1 ${
                path.startsWith('/catalog') ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              {t('navCatalog')}
              {path.startsWith('/catalog') && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>

            <button
              onClick={() => navigate('/stores')}
              className={`hover:text-neutral-900 transition-colors relative py-1 ${
                path.startsWith('/stores') || path.startsWith('/store') ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              {t('navStores')}
              {(path.startsWith('/stores') || path.startsWith('/store')) && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>

            {/* Virtual Try-On link with subtle badge */}
            <button
              onClick={() => navigate('/try-on')}
              className={`flex items-center gap-1.5 hover:text-neutral-900 transition-colors relative py-1 ${
                path === '/try-on' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              <Glasses className="w-4 h-4 text-amber-600" />
              <span>{t('navTryOn')}</span>
              {path === '/try-on' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions / Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => {
                if (currentUser) {
                  navigate('/customer/dashboard?tab=favorites');
                } else {
                  navigate('/catalog');
                }
              }}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors relative"
              aria-label="Favoris"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors relative"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account / Portal Access */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center font-semibold text-xs overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden lg:inline max-w-28 truncate">
                  {currentUser ? currentUser.name : t('navLogin')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500">{t('role' + (currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)) as any)}</p>
                        <p className="text-sm font-semibold text-neutral-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-neutral-400 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => navigate(getDashboardPath())}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                      >
                        <span>{t(currentUser.role === 'customer' ? 'customerPortal' : currentUser.role === 'seller' ? 'sellerPortal' : 'adminPortal')}</span>
                        {unreadNotifs > 0 && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
                            {unreadNotifs}
                          </span>
                        )}
                      </button>

                      <div className="border-t border-neutral-100 my-1" />

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs font-medium text-neutral-500">{t('loginTitle')}</p>
                      </div>
                      <button
                        onClick={() => navigate('/customer/login')}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        {t('customerPortal')}
                      </button>
                      <button
                        onClick={() => navigate('/seller/login')}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        {t('sellerPortal')}
                      </button>
                      <button
                        onClick={() => navigate('/admin/login')}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        {t('adminPortal')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="border-t border-neutral-100 bg-neutral-50/90 px-4 py-3 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2 bg-white text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                {t('filterPrice') ? 'Rechercher' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-medium text-neutral-800 border-b border-neutral-100"
            >
              {t('navHome')}
            </button>
            <button
              onClick={() => {
                navigate('/catalog');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-medium text-neutral-800 border-b border-neutral-100"
            >
              {t('navCatalog')}
            </button>
            <button
              onClick={() => {
                navigate('/stores');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-medium text-neutral-800 border-b border-neutral-100"
            >
              {t('navStores')}
            </button>
            <button
              onClick={() => {
                navigate('/try-on');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-medium text-amber-700 flex items-center gap-2 border-b border-neutral-100"
            >
              <Glasses className="w-4 h-4" />
              <span>{t('navTryOn')}</span>
            </button>
            <button
              onClick={() => {
                navigate(getDashboardPath());
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 font-medium text-neutral-800"
            >
              {t('navAccount')}
            </button>
          </div>
        )}
      </header>
    </>
  );
};
