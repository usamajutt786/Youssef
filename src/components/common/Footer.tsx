import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useI18n } from '../../context/I18nContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShieldCheck, Truck, RotateCcw, Glasses } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { t, lang, setLang } = useI18n();
  const { settings } = useMarketplace();

  return (
    <footer className="bg-neutral-900 text-neutral-400 text-sm mt-auto border-t border-neutral-800 transition-colors">
      {/* Trust & Craftsmanship Highlights */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Glasses className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                {t('tryOnTitle')}
              </h4>
              <p className="text-xs text-neutral-400">
                Superposition 2D haute définition sur photo sans transfert de données.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                Paiement à la Livraison (COD)
              </h4>
              <p className="text-xs text-neutral-400">
                Réglez en espèces directement auprès du livreur à la réception.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                Opticiens Certifiés
              </h4>
              <p className="text-xs text-neutral-400">
                Ateliers et créateurs indépendants vérifiés par notre équipe.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                Garantie & Retours
              </h4>
              <p className="text-xs text-neutral-400">
                Délai de rétractation et ajustement en atelier pour chaque monture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-display text-2xl font-bold tracking-tight text-white block">
              Optique<span className="text-amber-500">.</span>
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t('tagline')}. Plateforme multi-vendeurs dédiée à l'art de la lunetterie d'exception.
            </p>
            <div className="pt-2 text-xs text-neutral-500">
              <p>Contact : {settings.contactEmail}</p>
              <p>Support : {settings.supportPhone}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Explorer
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/catalog')} className="hover:text-white transition-colors">
                  {t('navCatalog')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/stores')} className="hover:text-white transition-colors">
                  {t('navStores')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/try-on')} className="hover:text-white transition-colors">
                  {t('navTryOn')}
                </button>
              </li>
            </ul>
          </div>

          {/* Spaces & Portals */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Portails
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/customer/login')} className="hover:text-white transition-colors">
                  {t('customerPortal')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/seller/login')} className="hover:text-white transition-colors">
                  {t('sellerPortal')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin/login')} className="hover:text-white transition-colors">
                  {t('adminPortal')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/seller/register')} className="text-amber-400 hover:text-amber-300 transition-colors">
                  Devenir vendeur partenaire
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Informations
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  {t('navContact')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  {t('navFaq')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  {t('navTerms')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                  {t('navPrivacy')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/returns')} className="hover:text-white transition-colors">
                  {t('navReturns')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 {settings.marketplaceName} — Prototype Démo Frontend pour client Youssef.</p>
          <div className="flex items-center gap-4">
            <span>Langue :</span>
            <button
              onClick={() => setLang('fr')}
              className={`hover:text-white transition-colors ${lang === 'fr' ? 'text-white font-semibold' : ''}`}
            >
              Français
            </button>
            <span>·</span>
            <button
              onClick={() => setLang('ar')}
              className={`hover:text-white transition-colors ${lang === 'ar' ? 'text-white font-semibold' : ''}`}
            >
              العربية (RTL)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
