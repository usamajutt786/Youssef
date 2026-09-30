import React from 'react';
import { I18nProvider, useI18n } from './context/I18nContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/public/HomePage';
import { CatalogPage } from './pages/public/CatalogPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { StoreDirectoryPage } from './pages/public/StoreDirectoryPage';
import { StoreDetailPage } from './pages/public/StoreDetailPage';
import { VirtualTryOnPage } from './pages/public/VirtualTryOnPage';
import { CartPage } from './pages/public/CartPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  TermsPage,
  PrivacyPage,
  ReturnsPage
} from './pages/public/StaticPages';

// Auth & Dashboards
import { CustomerAuth } from './pages/auth/CustomerAuth';
import { SellerAuth } from './pages/auth/SellerAuth';
import { AdminAuth } from './pages/auth/AdminAuth';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { path } = useRouter();
  const { dir } = useI18n();

  const renderCurrentView = () => {
    // Exact & Prefix Routing
    if (path === '/') return <HomePage />;
    if (path.startsWith('/catalog')) return <CatalogPage />;
    if (path.startsWith('/product/')) return <ProductDetailPage />;
    if (path === '/stores') return <StoreDirectoryPage />;
    if (path.startsWith('/store/')) return <StoreDetailPage />;
    if (path.startsWith('/try-on')) return <VirtualTryOnPage />;
    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;

    // Static Informational Pages
    if (path === '/about') return <AboutPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/faq') return <FaqPage />;
    if (path === '/terms') return <TermsPage />;
    if (path === '/privacy') return <PrivacyPage />;
    if (path === '/returns') return <ReturnsPage />;

    // Separate Portals & Login Pages
    if (path === '/customer/login') return <CustomerAuth mode="login" />;
    if (path === '/customer/register') return <CustomerAuth mode="register" />;
    if (path.startsWith('/customer/dashboard')) return <CustomerDashboard />;

    if (path === '/seller/login') return <SellerAuth mode="login" />;
    if (path === '/seller/register') return <SellerAuth mode="register" />;
    if (path.startsWith('/seller/dashboard')) return <SellerDashboard />;

    if (path === '/admin/login') return <AdminAuth />;
    if (path.startsWith('/admin/dashboard')) return <AdminDashboard />;

    return <HomePage />;
  };

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Top Demo Identity & Persona Switcher */}
      <DemoBanner />

      {/* Primary Top Bar Contract */}
      <Header />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <I18nProvider>
      <MarketplaceProvider>
        <AuthProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </AuthProvider>
      </MarketplaceProvider>
    </I18nProvider>
  );
}

export default App;
