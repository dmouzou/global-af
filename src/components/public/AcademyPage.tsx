import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { BabiMascot } from '../common/BabiMascot';
import { 
  BookOpen, 
  Award, 
  Clock, 
  GraduationCap, 
  Layers, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  X,
  ExternalLink,
  Users,
  Check
} from 'lucide-react';

interface AcademyPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onGoToDashboard, onOpenAuth }) => {
  const { courses, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Filter courses
  const filteredCourses = courses.filter(c => {
    if (activeTab === 'free') return !c.isPremium;
    if (activeTab === 'premium') return c.isPremium;
    return true;
  });

  const memberMatricule = currentUser?.memberNumber || 'GA-CI-2026-0001';

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero with 3D Academic Mascot */}
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 rounded-3xl p-6 sm:p-10 border border-orange-500/20 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold shadow-2xs">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>Digital Academy Côte d'Ivoire · Compétences & Certifications</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Formations Pratiques du Numérique
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Acquérez des compétences recherchées, adaptées aux réalités économiques locales (WhatsApp Business, prospection locale, e-commerce, outils IA) et valorisez votre savoir-faire avec des attestations officielles vérifiables.
            </p>

            {/* Guarantees pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% Pratique & Opérationnel
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold bg-white px-3 py-1 rounded-lg border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                Attestations Inviolables
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold bg-white px-3 py-1 rounded-lg border border-slate-200">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Dédié au Marché Ivoirien
              </span>
            </div>
          </div>

          {/* 3D Mascot Header Companion */}
          <div className="shrink-0 flex items-center justify-center p-4">
            <BabiMascot 
              variant="academic" 
              size="xl" 
              speechBubble="Bienvenue à l'Académie ! Explorez nos formations et commencez à apprendre depuis votre espace personnel !" 
            />
          </div>
        </div>

        {/* Comment ça fonctionne ? (Aperçu en 3 étapes simples) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Fonctionnement
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Comment suivre une formation ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Un parcours clair et accessible depuis votre espace membre personnel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Choisissez votre parcours
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consultez les thématiques disponibles (micro-jobs, réseaux sociaux, IA, marketing) selon vos objectifs professionnels.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Étudiez dans votre Espace Personnel
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accédez à vos modules de cours, lisez les leçons et complétez vos exercices à votre rythme dans votre tableau de bord dédié.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Décrochez votre Certification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Passez l'examen final depuis votre espace membre et recevez votre attestation numérique certifiée munie d'un identifiant unique.
              </p>
            </div>
          </div>
        </div>

        {/* Catalogue des Formations */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Catalogue des Formations
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Découvrez les parcours certifiants actuellement dispensés sur GLOBAL-AF.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Toutes ({courses.length})
              </button>
              <button
                onClick={() => setActiveTab('free')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'free' 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard Gratuites
              </button>
              <button
                onClick={() => setActiveTab('premium')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'premium' 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Réservées Premium
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {course.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {course.isPremium ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Inclus Membre Premium</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Accès Libre
                          </span>
                        )}
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.round(course.durationHours * 60)} min
                        </span>
                      </div>
                    </div>

                    {/* Course Title & Description */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    {/* Key Modules / Skills Preview */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                        <span>Thèmes abordés dans la formation :</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {course.modules.slice(0, 3).map((mod, idx) => (
                          <li key={mod.id || idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                            <span className="font-medium truncate">{mod.title.replace(/^Palier \d+ : /, '')}</span>
                          </li>
                        ))}
                        {course.modules.length > 3 && (
                          <li className="text-[11px] text-slate-500 pl-3.5 font-medium">
                            + {course.modules.length - 3} autre(s) module(s) pratique(s)
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      onClick={() => setPreviewCourse(course)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Voir le programme</span>
                    </button>

                    {currentUser ? (
                      <button
                        onClick={onGoToDashboard}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>Étudier dans mon espace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenAuth('signup')}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>S'inscrire pour commencer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Showcase Certificat Officiel */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Attestation Numérique d'Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Une reconnaissance vérifiable pour vos compétences
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Chaque attestation délivrée par la Digital Academy GLOBAL-AF comporte un identifiant unique et une signature numérique infalsifiable. Idéal pour prouver vos aptitudes auprès d'entreprises partenaires, de clients ou sur vos profils professionnels.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Voir un aperçu du certificat officiel</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center gap-4">
            <BabiMascot variant="academic" size="lg" />
            <div className="text-left text-xs space-y-1">
              <div className="font-extrabold text-white">Sceau d'Honneur Babi 🇨🇮</div>
              <div className="text-[11px] text-slate-400">Délivré avec succès après validation dans votre espace membre</div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL PROGRAMME DÉTAILLÉ */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  {previewCourse.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {previewCourse.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.round(previewCourse.durationHours * 60)} minutes
                  </span>
                  <span>·</span>
                  <span>Niveau : <strong className="text-slate-700">{previewCourse.level}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setPreviewCourse(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description du cours</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {previewCourse.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Programme des modules</h4>
                <div className="space-y-3">
                  {previewCourse.modules.map((mod, idx) => (
                    <div key={mod.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{mod.title.replace(/^Palier \d+ : /, '')}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {mod.durationMinutes} min
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                        {mod.content.slice(0, 160)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center gap-3">
                <BabiMascot variant="academic" size="xs" />
                <div className="text-xs text-orange-950">
                  <span className="font-bold">Accès et évaluation :</span> Cette formation et son examen officiel se déroulent au sein de votre espace personnel sécurisé.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Fermer
              </button>
              {currentUser ? (
                <button
                  onClick={() => {
                    setPreviewCourse(null);
                    onGoToDashboard();
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-2"
                >
                  <span>Démarrer dans mon espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPreviewCourse(null);
                    onOpenAuth('signup');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-2"
                >
                  <span>S'inscrire pour étudier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SAMPLE CERTIFICATE PREVIEW MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative">
            
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 text-white text-center relative border-b-4 border-orange-500">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7700] via-amber-500 to-[#009E49] p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-notable text-xs">
                    GA
                  </div>
                </div>
                <span className="font-notable tracking-tight text-lg">
                  GLOBAL<span className="text-orange-400">-AF</span>
                </span>
              </div>
              <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold">
                Digital Academy · République de Côte d'Ivoire
              </h3>
              <div className="text-xl sm:text-2xl font-bold mt-1 text-white">
                Attestation Numérique de Réussite
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-8 space-y-6 text-center bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Modèle d'attestation officielle délivrée à la fin d'un parcours :
              </p>

              <div className="space-y-1">
                <div className="text-2xl font-extrabold text-slate-900">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Exemple d\'Apprenant Certifié'}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs">
                  <span className="text-slate-500">Matricule :</span>
                  <span className="font-notable text-slate-900">{memberMatricule}</span>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-sm font-bold text-slate-900 max-w-md mx-auto">
                Spécialisation en Stratégies Digitales & Micro-Missions
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-left">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Identifiant Certificat</div>
                  <div className="text-xs font-notable text-slate-800">GA-CERT-CI-9042</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Signature & Sécurité</div>
                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Inviolable Conforme</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Vérifiable en ligne avec identifiant unique</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                  <BabiMascot variant="academic" size="xs" />
                  <span className="text-[11px] font-bold text-orange-950">Sceau Académie</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  Fermer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
