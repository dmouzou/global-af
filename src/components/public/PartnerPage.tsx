import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Briefcase, 
  Users, 
  Send, 
  PlusCircle, 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { PartnerApplication, Task } from '../../types';
import { BabiMascot } from '../common/BabiMascot';
import { useApp } from '../../context/AppContext';

interface PartnerPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PartnerPage: React.FC<PartnerPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { currentUser, tasks } = useApp();

  // Registration form states - all empty by default with ghost suggestions
  const [companyName, setCompanyName] = useState('');
  const [rccm, setRccm] = useState('');
  const [sector, setSector] = useState('Fintech & Mobile Money');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | null>(null);

  // New Mission creation state for approved partners
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false);
  const [missionTitle, setMissionTitle] = useState('');
  const [missionCategory, setMissionCategory] = useState<any>('survey');
  const [missionReward, setMissionReward] = useState(1500);
  const [missionQuota, setMissionQuota] = useState(100);
  const [missionDescription, setMissionDescription] = useState('');
  const [missionSubmittedSuccess, setMissionSubmittedSuccess] = useState(false);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !rccm.trim() || !phone.trim() || !email.trim()) {
      alert("Veuillez renseigner les champs obligatoires (Raison Sociale, RCCM, Téléphone, E-mail).");
      return;
    }
    setApplicationSubmitted(true);
    setApplicationStatus('pending');
  };

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle.trim() || !missionDescription.trim()) {
      alert("Veuillez renseigner le titre et les instructions de la mission.");
      return;
    }
    setMissionSubmittedSuccess(true);
    setTimeout(() => {
      setMissionSubmittedSuccess(false);
      setShowCreateMissionModal(false);
      setMissionTitle('');
      setMissionDescription('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero with 3D Babi Mascot */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-orange-500/20">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold">
              <Building2 className="w-4 h-4 text-orange-400" />
              <span>Espace Partenaires & Entreprises · Marché Côte d'Ivoire</span>
            </div>

            <div className="flex items-center gap-3">
              <BabiMascot variant="security" size="lg" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Accélérez vos sondages, tests & visibilité locale avec nos membres
              </h1>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Déposez vos micro-missions et accédez à une communauté active de milliers d'utilisateurs vérifiés à Abidjan et à l'intérieur du pays. Rémunérations directes par Mobile Money et reporting d'exécution en temps réel.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Vérification formelle RCCM
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-orange-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Conforme Charte ARTCI & UEMOA
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Facturation B2B déductible
              </span>
            </div>
          </div>
        </div>

        {/* 3 Key Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <BabiMascot variant="waving" size="sm" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Sondages & Études d'Opinion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interrogez des segments ciblés (âge, commune, niveau de revenus, habitudes d'achat) et recueillez les réponses de membres (volume et délais précisés dans le devis ; aucun résultat n'est garanti).
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <BabiMascot variant="ai" size="sm" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Crowd-Testing d'Applications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Faites tester vos applications mobiles (Android, iOS) et sites web sur divers réseaux ivoiriens (Orange, MTN, Moov, Wave) pour détecter les bugs avant vos lancements.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <BabiMascot variant="badge" size="sm" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Visibilité & Notoriété Digitale</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Générez de l'engagement qualifié sur vos campagnes institutionnelles, vidéos de marque et revues de produits avec des preuves d'exécution individuelles vérifiées.
            </p>
          </div>
        </div>

        {/* Application Status Banner OR Application Form */}
        {applicationSubmitted ? (
          <div className="p-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl border border-emerald-300 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                  <span>Dossier Partenaire Reçu avec Succès</span>
                  <span className="text-xs bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-full font-mono">
                    En cours de vérification
                  </span>
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Entreprise : <strong>{companyName}</strong> (RCCM : {rccm}) · Contact : {contactName} ({phone})
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p>
                Conformément aux directives de transparence de GLOBAL-AF, chaque inscription d'entreprise partenaire fait l'objet d'un contrôle de régularité juridique (numéro RCCM et vérification du représentant) depuis le panneau d'administration.
              </p>
              <p className="font-semibold text-emerald-900">
                ✓ Un chargé de compte B2B prendra contact avec vous sous 24h ouvrées pour valider l'activation de votre espace de soumission de campagnes.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setApplicationStatus('approved')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
              >
                Simuler l'approbation administrative
              </button>
              <button
                onClick={() => setApplicationSubmitted(false)}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Modifier mon dossier
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BabiMascot variant="security" size="sm" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Formulaire d'Enregistrement Partenaire & Entreprise
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Présentez les informations de votre structure pour ouvrir votre espace de dépôt de micro-jobs
                </p>
              </div>
              <span className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 font-semibold self-start sm:self-auto">
                Vérification sous 24h
              </span>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Raison Sociale / Nom Entreprise <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ex. Wave Côte d'Ivoire SARL ou Orange CI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro RCCM ou Registre Commercial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                    placeholder="ex. CI-ABJ-2023-B-14029"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Secteur d'activité <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="Fintech & Mobile Money">Fintech, Banque & Mobile Money</option>
                    <option value="Télécoms & Fournisseurs d'Accès">Télécoms & Fournisseurs d'Accès</option>
                    <option value="E-Commerce & Retail">E-Commerce, Marketplace & Distribution</option>
                    <option value="Agroalimentaire & FMCG">Agroalimentaire & Grande Consommation</option>
                    <option value="Transport & Logistique">Transport, VTC & Logistique</option>
                    <option value="Éducation & Formation">Éducation & Formation</option>
                    <option value="Autre secteur">Autre secteur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville & Commune du Siège <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="ex. Abidjan (Plateau, Zone 4 ou Cocody)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom du Responsable <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="ex. Jean-Marc Kouassi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fonction du contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="ex. Directeur Marketing, Responsable Produit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro de Téléphone (Mobile / WhatsApp Pro) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ex. 07 68 93 18 44"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse E-mail Professionnelle <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex. contact@entreprise.ci"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description des besoins ou types de micro-jobs envisagés
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez brièvement les missions que vous souhaitez soumettre (ex: sondage 10 questions sur le paiement mobile, test de fluidité d'un tunnel d'achat, etc.)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Vos données sont traitées en toute confidentialité sous la charte ARTCI.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Soumettre mon dossier Partenaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* APPROVED PARTNER DASHBOARD (Visible when approved) */}
        {applicationStatus === 'approved' && (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 p-8 shadow-lg space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <BabiMascot variant="academic" size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      Tableau de Bord Partenaire Actif
                    </h2>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      ✓ Partenaire Validé
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Compte : {companyName || 'Wave CI'} · Déposez et suivez l'exécution de vos campagnes en direct
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateMissionModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Déposer un Nouveau Micro-job</span>
              </button>
            </div>

            {/* Partner KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Missions Actives</span>
                <div className="text-2xl font-bold text-slate-900 font-notable mt-1">2</div>
                <div className="text-[10px] text-emerald-600 mt-1">● Exécution en cours</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Participations Validées</span>
                <div className="text-2xl font-bold text-orange-600 font-notable mt-1">184</div>
                <div className="text-[10px] text-slate-500 mt-1">Preuves d'exécution conformes</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Budget Engagé</span>
                <div className="text-2xl font-bold text-emerald-700 font-notable mt-1">276 000 FCFA</div>
                <div className="text-[10px] text-slate-500 mt-1">Rémunérations reversées aux membres</div>
              </div>
            </div>

            {/* List of active partner missions */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Vos Campagnes en Cours</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    Sondage sur l'adoption des cartes virtuelles Wave en Côte d'Ivoire
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Quota : 124 / 200 réponses · Rémunération : 1 200 FCFA / participant
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    62% Réalisé
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CREATE MISSION MODAL */}
      {showCreateMissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BabiMascot variant="ai" size="sm" />
                <h3 className="text-base font-bold text-slate-900">
                  Déposer un Micro-job d'Entreprise
                </h3>
              </div>
              <button
                onClick={() => setShowCreateMissionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {missionSubmittedSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-emerald-950">Micro-job publié avec succès !</div>
                <p className="text-xs text-emerald-800">
                  Votre mission a été injectée dans le flux public et sera accessible aux membres actifs dès validation de la provision.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateMission} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre explicite de la mission
                  </label>
                  <input
                    type="text"
                    required
                    value={missionTitle}
                    onChange={(e) => setMissionTitle(e.target.value)}
                    placeholder="ex. Test fonctionnel de la nouvelle mise à jour v2.4 sur Android"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={missionCategory}
                      onChange={(e) => setMissionCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-white"
                    >
                      <option value="survey">Sondage d'opinion</option>
                      <option value="app_test">Test d'application</option>
                      <option value="content_review">Revue de contenu</option>
                      <option value="partner_campaign">Campagne Partenaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rémunération par membre
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={100}
                      value={missionReward}
                      onChange={(e) => setMissionReward(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quota de participants ciblés
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={missionQuota}
                    onChange={(e) => setMissionQuota(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instructions & Critères de validation
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={missionDescription}
                    onChange={(e) => setMissionDescription(e.target.value)}
                    placeholder="Détaillez les étapes que le membre doit accomplir et le justificatif attendu (capture d'écran, lien ou texte de confirmation)..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateMissionModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Publier le micro-job
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
