import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Mail, Phone, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-display text-3xl font-bold text-neutral-900">
        À propos d'Optique Marketplace
      </h1>
      <p className="text-sm text-neutral-600 leading-relaxed">
        Optique Marketplace est une place de marché collaborative dédiée aux opticiens indépendants, créateurs lunetiers et ateliers d'exception. Notre mission est de connecter les passionnés de design et d'optique de précision avec des artisans vérifiés.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 bg-white rounded-2xl border border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-2">Artisanat & Authenticité</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Chaque vendeur sur la plateforme est soigneusement sélectionné pour son expertise, la traçabilité des matériaux (titane japonais, acétates certifiés) et son respect des normes européennes.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-2">Essayage Virtuel Transparent</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Grâce à notre studio photo 2D sécurisé en local, testez nos montures sur votre visage avant de passer commande en toute sérénité avec le paiement à la livraison (COD).
          </p>
        </div>
      </div>
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
        <strong>Note de démo :</strong> Cette plateforme est un prototype frontend interactif pour le client Youssef. Les opticiens et produits présentés sont des données de démonstration.
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings } = useMarketplace();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Contactez l'Équipe Optique
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Une question concernant une monture ou une boutique partenaire ?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4 text-xs text-neutral-600">
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-1">
            <Mail className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-neutral-900 block">Support Client Démo</span>
            <p>{settings.contactEmail}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-1">
            <Phone className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-neutral-900 block">Téléphone</span>
            <p>{settings.supportPhone}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-1">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-neutral-900 block">Siège Plateforme</span>
            <p>Paris & Casablanca</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-neutral-900 text-sm">Message simulé envoyé avec succès !</h3>
              <p className="text-xs text-neutral-500">
                Ceci est une confirmation locale de démo. Dans la version finale avec serveur, ce message sera transmis au service support.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Votre Nom *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Adresse Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Votre Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Envoyer le message (Simulation Démo)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'Comment fonctionne le studio d\'essayage virtuel 2D ?',
      a: 'Notre outil superpose une monture transparente vectorielle en haute résolution directement sur une photo de face de votre choix. Vous pouvez glisser l\'élement au doigt ou à la souris, l\'agrandir et l\'orienter à volonté.'
    },
    {
      q: 'Mes photos de visage sont-elles sauvegardées ?',
      a: 'Non. Vos photos restent exclusivement dans la mémoire vive de votre navigateur. Elles ne sont ni téléchargées sur un serveur distant, ni conservées après fermeture du studio.'
    },
    {
      q: 'Comment fonctionne le paiement à la livraison (COD) ?',
      a: 'Le paiement à la livraison est le mode de règlement exclusif de cette phase de lancement. Vous payez en espèces auprès du transporteur uniquement lorsque vous recevez et vérifiez votre colis.'
    },
    {
      q: 'Comment sont gérées les commandes multi-vendeurs ?',
      a: 'Lorsque votre panier contient des articles de plusieurs boutiques, le système génère automatiquement des sous-commandes distinctes pour chaque opticien. Chaque vendeur prépare et expédie son propre colis avec un numéro de suivi indépendant.'
    },
    {
      q: 'Puis-je commander des verres correcteurs gradués ?',
      a: 'Dans cette version de lancement, la marketplace propose la sélection de montures optiques et de lunettes solaires/anti-lumière bleue. Les ordonnances et la saisie de correction ophtalmique sont réservées à une phase ultérieure.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-display text-3xl font-bold text-neutral-900">
        Foire Aux Questions (FAQ)
      </h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-neutral-200 space-y-2">
            <h3 className="font-semibold text-sm text-neutral-900">{f.q}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-neutral-700 leading-relaxed">
      <h1 className="font-display text-3xl font-bold text-neutral-900">
        Conditions Générales de Vente (Projet / Draft)
      </h1>
      <p className="italic text-neutral-500">Document modèle de démonstration, non validé juridiquement.</p>

      <section className="space-y-2 bg-white p-6 rounded-2xl border border-neutral-200">
        <h3 className="font-bold text-sm text-neutral-900">1. Objet de la plateforme</h3>
        <p>
          Optique Marketplace agit en qualité d'intermédiaire technique mettant en relation des vendeurs professionnels opticiens avec des acheteurs finaux. Les contrats de vente sont conclus directement entre l'acheteur et chaque vendeur respectif.
        </p>

        <h3 className="font-bold text-sm text-neutral-900 pt-2">2. Modalités de paiement (COD)</h3>
        <p>
          Toutes les commandes sont conclues avec l'obligation de règlement en espèces à la livraison. Le refus injustifié de paiement au transporteur lors de la remise peut entraîner la suspension du compte client.
        </p>

        <h3 className="font-bold text-sm text-neutral-900 pt-2">3. Outil d'essayage visuel 2D</h3>
        <p>
          L'outil d'essayage photo 2D est un aperçu esthétique et indicatif. Il ne constitue pas un acte de biométrie médicale et ne garantit pas la compatibilité anatomique exacte sans ajustement physique chez un opticien.
        </p>
      </section>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-neutral-700 leading-relaxed">
      <h1 className="font-display text-3xl font-bold text-neutral-900">
        Politique de Confidentialité (Draft Démo)
      </h1>
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
        <h3 className="font-bold text-sm text-neutral-900">Protection des données faciales</h3>
        <p>
          L'application n'effectue aucun enregistrement persistant ni téléversement de vos photos de visage vers des serveurs distants ou des services d'intelligence artificielle tiers. Le traitement graphique s'exécute intégralement dans le moteur Canvas HTML5 de votre navigateur web.
        </p>
        <h3 className="font-bold text-sm text-neutral-900">Cookies & Stockage local</h3>
        <p>
          La présente démonstration utilise le stockage local (localStorage) exclusivement pour mémoriser l'état du panier, la langue sélectionnée (FR/AR) et vos commandes de démo au cours de votre session de test.
        </p>
      </div>
    </div>
  );
};

export const ReturnsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-neutral-700 leading-relaxed">
      <h1 className="font-display text-3xl font-bold text-neutral-900">
        Politique de Retour & Réclamations (Draft)
      </h1>
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
        <h3 className="font-bold text-sm text-neutral-900">Délai de rétractation de 14 jours</h3>
        <p>
          Conformément aux usages du commerce optique, le client dispose d'un délai de 14 jours calendaires à compter de la réception de son colis pour formuler une demande de retour auprès de la boutique vendeuse via son espace client.
        </p>
        <h3 className="font-bold text-sm text-neutral-900">État de la monture</h3>
        <p>
          Pour être éligible au retour, la monture ne doit comporter aucune micro-rayure, altération de branches et doit être retournée dans son étui d'origine avec sa chamoisine de protection.
        </p>
      </div>
    </div>
  );
};
