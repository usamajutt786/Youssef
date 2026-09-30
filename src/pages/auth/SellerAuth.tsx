import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useRouter } from '../../context/RouterContext';
import { Store as StoreIcon, Lock, Mail, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const SellerAuth: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const { login, loginAsDemo, registerSeller, simulatedResetPassword } = useAuth();
  const { createStore } = useMarketplace();
  const { t, lang } = useI18n();
  const { navigate } = useRouter();

  // Login fields
  const [email, setEmail] = useState('karim@atelier-optique.com');
  const [password, setPassword] = useState('demo123');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetMessage, setResetMessage] = useState(false);

  // Registration fields
  const [sellerName, setSellerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('France');
  const [hasDoc, setHasDoc] = useState(false);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, 'seller');
    if (res.success) {
      navigate('/seller/dashboard');
    } else {
      setErrorMsg(res.message || 'Identifiants vendeur invalides');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !regEmail || !phone || !storeName || !city) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const res = registerSeller(sellerName, regEmail, phone, storeName);
    if (res.success && res.user) {
      // Create store with pending status
      createStore({
        sellerId: res.user.id,
        sellerName,
        name: storeName,
        city,
        country,
        location: `${city}, ${country}`,
        phone,
        email: regEmail
      });
      setRegistrationSubmitted(true);
    } else {
      setErrorMsg('Cet email vendeur est déjà enregistré.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 max-w-lg w-full shadow-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {t('sellerPortal')}
          </span>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {mode === 'login' ? 'Espace Opticien & Vendeur' : 'Candidature Boutique Partenaire'}
          </h1>
          <p className="text-xs text-neutral-500">
            {mode === 'login'
              ? 'Accédez à vos commandes, stocks et configuration d\'essayage 2D.'
              : 'Rejoignez le collectif d\'opticiens indépendants de référence.'}
          </p>
        </div>

        {/* Quick Demo Logins for both sellers */}
        {mode === 'login' && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2.5 text-xs">
            <span className="font-semibold text-neutral-900 block">
              Comptes vendeurs de démonstration :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemo('seller', 0);
                  navigate('/seller/dashboard');
                }}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-left transition-colors"
              >
                <strong className="block text-[11px] text-amber-400">Atelier Optique (Karim)</strong>
                <span className="text-[10px] text-neutral-400 block truncate">Paris · Titane & Rondes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemo('seller', 1);
                  navigate('/seller/dashboard');
                }}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-left transition-colors"
              >
                <strong className="block text-[11px] text-amber-400">Luxe Vision (Sofia)</strong>
                <span className="text-[10px] text-neutral-400 block truncate">Casablanca · Solaires</span>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {registrationSubmitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-neutral-900">Demande d'adhésion enregistrée !</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Votre boutique <strong>{storeName}</strong> a été soumise pour examen. L'administrateur de la plateforme doit approuver votre compte avant que vos montures ne soient visibles publiquement.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
              >
                Accéder au tableau de bord (Statut en attente)
              </button>
            </div>
          </div>
        ) : mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Email professionnel *</label>
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
                <button
                  type="button"
                  onClick={() => setResetMessage(true)}
                  className="text-neutral-500 hover:text-neutral-900 text-[11px] underline"
                >
                  {t('forgotPassword')}
                </button>
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

            {resetMessage && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded">
                Lien de réinitialisation simulé envoyé à votre adresse vendeur !
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Accéder à l'espace vendeur
            </button>
          </form>
        ) : (
          /* Registration Form with Verification UI */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Nom de l'opticien / gérant *</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Nom de l'atelier / boutique *</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="Optique Haussmann"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Email professionnel *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="contact@optique.com"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Téléphone mobile *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+33 1..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Paris"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Pays *</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  <option value="France">France</option>
                  <option value="Maroc">Maroc</option>
                  <option value="Tunisie">Tunisie</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                </select>
              </div>
            </div>

            {/* Optional Verification Document Upload UI */}
            <div>
              <label className="block text-neutral-700 font-medium mb-1">
                Document d'immatriculation professionnelle (KBIS / Registre)
              </label>
              <div
                onClick={() => setHasDoc(!hasDoc)}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-2 ${
                  hasDoc ? 'border-emerald-500 bg-emerald-50/50' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
                }`}
              >
                <Upload className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-700">
                  {hasDoc ? 'Extrait_Registre_Commerce.pdf (Simulé)' : 'Sélectionner un document justificatif (Simulation démo)'}
                </span>
              </div>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
              <strong>Processus d'onboarding :</strong> Après soumission, votre boutique sera soumise au statut « En attente de validation » dans la console d'administration.
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Soumettre mon dossier de candidature
            </button>
          </form>
        )}

        {/* Switch Login/Register */}
        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          {mode === 'login' ? (
            <p>
              Vous êtes opticien et souhaitez vendre sur Optique ?{' '}
              <button
                onClick={() => navigate('/seller/register')}
                className="text-neutral-900 font-semibold underline"
              >
                Créer une boutique
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit en tant qu'opticien ?{' '}
              <button
                onClick={() => navigate('/seller/login')}
                className="text-neutral-900 font-semibold underline"
              >
                Connexion vendeur
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
