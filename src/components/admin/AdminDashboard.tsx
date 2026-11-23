import React, { useEffect, useState } from 'react';
import { Briefcase, ClipboardCheck, FileText, History, LayoutDashboard, Megaphone, SlidersHorizontal, RotateCcw, ScrollText, ShieldAlert, Smartphone, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { can, ROLE_LABEL } from '../../lib/staff';
import { AdminShell, AdminNavItem } from './AdminShell';
import { AdminOverview } from './tabs/AdminOverview';
import { AdminWithdrawals } from './tabs/AdminWithdrawals';
import { AdminRefunds } from './tabs/AdminRefunds';
import { AdminRisks } from './tabs/AdminRisks';
import { AdminMissions } from './tabs/AdminMissions';
import { AdminSubmissions } from './tabs/AdminSubmissions';
import { AdminUsers } from './tabs/AdminUsers';
import { AdminAudit } from './tabs/AdminAudit';
import { AdminRules } from './tabs/AdminRules';
import { AdminPartners } from './tabs/AdminPartners';
import { AdminSettings } from './tabs/AdminSettings';

interface AdminDashboardProps {
  advertiserInfo: { email: string; companyName: string; role: 'admin' | 'advertiser' };
  onLogout: () => void;
  onReturnToPublic?: () => void;
}

/** Console du personnel : chaque rôle ne voit que ses sections (le serveur contrôle de toute façon chaque action). */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ advertiserInfo, onLogout, onReturnToPublic }) => {
  const { currentUser, adminWithdrawals, adminRefunds, adminSubmissions } = useApp();
  const role = currentUser?.role;
  const [active, setActive] = useState('overview');

  const items: AdminNavItem[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
    ...(can.finance(role) ? [
      { id: 'withdrawals', label: 'Retraits', icon: Smartphone, badge: adminWithdrawals.filter(w => ['reserved', 'approved', 'payout_initiated'].includes(w.status)).length },
      { id: 'refunds', label: 'Remboursements', icon: RotateCcw, badge: adminRefunds.filter(r => r.status === 'pending').length },
      { id: 'risks', label: 'Risques', icon: ShieldAlert },
    ] : []),
    ...(can.content(role) ? [{ id: 'missions', label: 'Missions', icon: Briefcase }] : []),
    ...(can.moderation(role) ? [{ id: 'submissions', label: 'Preuves', icon: ClipboardCheck, badge: adminSubmissions.length }] : []),
    ...(can.support(role) ? [{ id: 'users', label: 'Membres', icon: Users }] : []),
    ...(can.admin(role) ? [
      { id: 'partners', label: 'Entreprises', icon: Megaphone },
      { id: 'audit', label: "Journal d'audit", icon: History },
    ] : []),
    ...(can.superAdmin(role) ? [{ id: 'settings', label: 'Paramètres', icon: SlidersHorizontal }] : []),
    { id: 'rules', label: 'Règles', icon: ScrollText },
  ].map(i => ({ ...i, badge: i.badge || undefined }));

  // Si le rôle change ou si l'onglet n'est plus autorisé, retour à la vue d'ensemble.
  useEffect(() => { if (!items.some(i => i.id === active)) setActive('overview'); }, [role]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { window.scrollTo({ top: 0 }); }, [active]);

  if (!currentUser || !can.staff(role)) {
    return <div className="grid min-h-screen place-items-center bg-mist p-6 text-center"><div><FileText className="mx-auto h-10 w-10 text-ink/30" /><p className="mt-3 font-bold">Accès réservé au personnel autorisé.</p></div></div>;
  }

  return (
    <AdminShell items={items} active={active} onSelect={setActive} roleLabel={ROLE_LABEL[currentUser.role]} email={advertiserInfo.email} onLogout={onLogout} onPublic={onReturnToPublic}>
      {active === 'overview' && <AdminOverview onGo={setActive} />}
      {active === 'withdrawals' && can.finance(role) && <AdminWithdrawals />}
      {active === 'refunds' && can.finance(role) && <AdminRefunds />}
      {active === 'risks' && can.finance(role) && <AdminRisks />}
      {active === 'missions' && can.content(role) && <AdminMissions />}
      {active === 'submissions' && can.moderation(role) && <AdminSubmissions />}
      {active === 'users' && can.support(role) && <AdminUsers />}
      {active === 'partners' && can.admin(role) && <AdminPartners />}
      {active === 'audit' && can.admin(role) && <AdminAudit />}
      {active === 'settings' && can.superAdmin(role) && <AdminSettings />}
      {active === 'rules' && <AdminRules />}
    </AdminShell>
  );
};
