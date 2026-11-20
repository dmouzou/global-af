import React, { useState } from 'react';
import { ArrowRight, BarChart3, Ban, ClipboardCheck, Megaphone, Send } from 'lucide-react';
import { IlluPartners, ScarfRibbon } from '../brand/Illustrations';
import { Eyebrow, GhostButton, PageHero, PrimaryButton } from '../ui/kit';

interface PartnerPageProps {
  onGoToDashboard: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const CONTACT_EMAIL = 'contact@ahglobal.com';

const FORMATS = [
  { t: 'Missions partenaires', d: 'Sondage, test d’application ou quiz : les membres participent et vous recevez des retours réels.' },
  { t: 'Bannière', d: 'Visibilité dans l’espace membre et sur le site public.' },
  { t: 'Vidéo', d: 'Un contenu vidéo présenté dans les parcours de découverte.' },
  { t: 'Contenu sponsorisé', d: 'Un article ou un guide qui apporte une vraie information à la communauté.' },
  { t: 'Promotion', d: 'Une offre claire, avec prix, conditions et durée affichés.' },
  { t: 'Carte sponsorisée', d: 'Un encart sobre au sein des listes de missions ou de formations.' },
];

const fieldCls = 'mt-1.5 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-wax';

export const PartnerPage: React.FC<PartnerPageProps> = () => {
  const [companyName, setCompanyName] = useState('');
  const [rccm, setRccm] = useState('');
  const [sector, setSector] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !rccm.trim() || !phone.trim() || !email.trim()) {
      setError('Renseignez la raison sociale, le RCCM, un téléphone et un e-mail.');
      return;
    }
    setError(null);
    const body = [
      'Demande de partenariat AH GLOBAL',
      '',
      `Raison sociale : ${companyName}`,
      `RCCM : ${rccm}`,
      `Secteur : ${sector || '—'}`,
      `Ville : ${city || '—'}`,
      `Contact : ${contactName || '—'} (${contactRole || '—'})`,
      `Téléphone : ${phone}`,
      `E-mail : ${email}`,
      '',
      'Projet de campagne :',
      description || '—',
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Demande de partenariat : ${companyName}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow="Entreprises et partenaires"
        title="Touchez une audience mobile avec des campagnes relues et honnêtes."
        subtitle="Missions partenaires, contenus sponsorisés, bannières. Chaque campagne est examinée avant publication, et les mécanismes de hasard ou de paris sont refusés."
        actions={
          <>
            <PrimaryButton onClick={() => document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth' })}>Faire une demande <ArrowRight className="h-5 w-5" /></PrimaryButton>
            <GhostButton onClick={() => document.getElementById('formats')?.scrollIntoView({ behavior: 'smooth' })}>Voir les formats</GhostButton>
          </>
        }
        illustration={<IlluPartners className="w-full" title="Illustration : une vitrine, un mégaphone et des barres de résultats" />}
      />

      <section id="formats" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Eyebrow>Formats</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Des formats sobres, pour des membres qui lisent avant d'agir.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map(f => (
            <article key={f.t} className="rounded-3xl border border-ink/10 bg-white p-6">
              <Megaphone className="h-6 w-6 text-wax" />
              <h3 className="mt-4 font-display text-xl font-bold">{f.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Eyebrow>Le parcours</Eyebrow>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">De votre dossier à la diffusion.</h2>
            <ol className="mt-8 space-y-4">
              {[
                ['Votre dossier', "Raison sociale, RCCM, contact et description de votre projet de campagne."],
                ['Vérification', "Nous contrôlons la régularité de votre structure avant d'ouvrir votre espace."],
                ['Validation de la campagne', 'Budget, période, pays, audience, objectif, créatif et lien sont relus avant publication.'],
                ['Diffusion et suivi', 'Impressions, clics, participations et conversions, lorsqu’ils sont mesurables.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink/10">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink font-display text-lg font-extrabold text-white">{i + 1}</span>
                  <div><h3 className="font-display text-lg font-bold">{t}</h3><p className="mt-1 text-[15px] leading-relaxed text-ink/65">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-5">
            <div className="rounded-[2rem] bg-ink p-8 text-white">
              <Ban className="h-8 w-8 text-sun" />
              <h3 className="mt-4 font-display text-2xl font-extrabold">Ce que nous refusons</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-white/80">
                <li>Les jeux de hasard, loteries, tombolas et tirages au sort.</li>
                <li>La promotion de sites de paris et de jeux d'argent.</li>
                <li>Le faux engagement et toute manipulation interdite par les plateformes.</li>
                <li>Les promesses de gain facile ou garanti.</li>
              </ul>
            </div>
            <div className="rounded-[2rem] bg-white p-8 ring-1 ring-ink/10">
              <BarChart3 className="h-8 w-8 text-leaf" />
              <h3 className="mt-4 font-display text-2xl font-extrabold">Des résultats lisibles</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">Un compte rendu clair de la diffusion. Nous n'annonçons aucun chiffre d'audience tant qu'il n'est pas mesuré.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demande" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-center">
          <Eyebrow>Demande de partenariat</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">Présentez votre structure et votre projet.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/65">
            Ce formulaire prépare un e-mail adressé à <strong>{CONTACT_EMAIL}</strong>. Rien n'est enregistré sur cette page : le message part depuis votre messagerie.
          </p>
        </div>
        <form onSubmit={submit} className="mt-10 grid gap-5 rounded-[2rem] bg-white p-6 ring-1 ring-ink/10 sm:grid-cols-2 sm:p-8">
          <label className="text-sm font-bold">Raison sociale *<input className={fieldCls} value={companyName} onChange={e => setCompanyName(e.target.value)} autoComplete="organization" /></label>
          <label className="text-sm font-bold">Numéro RCCM *<input className={fieldCls} value={rccm} onChange={e => setRccm(e.target.value)} /></label>
          <label className="text-sm font-bold">Secteur d'activité<input className={fieldCls} value={sector} onChange={e => setSector(e.target.value)} /></label>
          <label className="text-sm font-bold">Ville<input className={fieldCls} value={city} onChange={e => setCity(e.target.value)} autoComplete="address-level2" /></label>
          <label className="text-sm font-bold">Nom du contact<input className={fieldCls} value={contactName} onChange={e => setContactName(e.target.value)} autoComplete="name" /></label>
          <label className="text-sm font-bold">Fonction<input className={fieldCls} value={contactRole} onChange={e => setContactRole(e.target.value)} autoComplete="organization-title" /></label>
          <label className="text-sm font-bold">Téléphone *<input className={fieldCls} type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" /></label>
          <label className="text-sm font-bold">E-mail *<input className={fieldCls} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
          <label className="text-sm font-bold sm:col-span-2">Votre projet de campagne
            <textarea className={`${fieldCls} min-h-28`} value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          {error && <p role="alert" className="rounded-2xl bg-rose-50 p-3.5 text-sm font-semibold text-rose-700 sm:col-span-2">{error}</p>}
          <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
            <p className="flex items-center gap-2 text-[13px] text-ink/55"><ClipboardCheck className="h-4 w-4" />Les champs * sont obligatoires.</p>
            <PrimaryButton type="submit"><Send className="h-5 w-5" />Préparer mon e-mail</PrimaryButton>
          </div>
        </form>
      </section>
      <ScarfRibbon />
    </div>
  );
};
