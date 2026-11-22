import React from 'react';
import { Mail } from 'lucide-react';
import { EmptyState, PageTitle } from '../../dashboard/ui';

export const AdminPartners: React.FC = () => (
  <div className="space-y-5">
    <PageTitle title="Entreprises et campagnes" subtitle="Demandes de partenariat et validation des campagnes (formats, budget, période, pays, créatif, lien)." />
    <EmptyState mood="wave" prop="phone" title="Pas encore de gestion en ligne."
      text="Les demandes arrivent par e-mail à contact@ahglobal.com (formulaire de la page Entreprises). Il n'existe pas encore de base de campagnes, de validation ni de reporting dans la console : c'est l'un des prochains chantiers. Refusez tout projet contenant un mécanisme de hasard, de la promotion de paris ou de faux engagement."
      action={<a href="mailto:contact@ahglobal.com" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white"><Mail className="h-4 w-4" />Ouvrir la boîte de réception</a>} />
  </div>
);
