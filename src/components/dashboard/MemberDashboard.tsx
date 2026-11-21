import React, { useEffect, useState } from 'react';
import {
  Bell, BookOpen, Briefcase, FolderDown, Gift, LayoutDashboard, LifeBuoy, MessageSquare, Settings,
  Smartphone, Sparkles, User as UserIcon, Users, Wallet as WalletIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { BabiVector } from '../brand/BabiVector';
import { DashboardShell, NavItem } from './DashboardShell';
import { Banners } from './Banners';
import { Btn } from './ui';
import { WithdrawalModal } from './modals/WithdrawalModal';
import { ActivationModal, ActivationPlan } from './modals/ActivationModal';
import { TaskProofModal } from './modals/TaskProofModal';
import { OverviewTab } from './tabs/OverviewTab';
import { TasksTab } from './tabs/TasksTab';
import { WalletTab } from './tabs/WalletTab';
import { WithdrawalsTab } from './tabs/WithdrawalsTab';
import { TeamTab } from './tabs/TeamTab';
import { CommunityTab } from './tabs/CommunityTab';
import { AcademyTab } from './tabs/AcademyTab';
import { AiToolsTab } from './tabs/AiToolsTab';
import { VcfTab } from './tabs/VcfTab';
import { BonusTab } from './tabs/BonusTab';
import { ProfileTab } from './tabs/ProfileTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { SupportTab } from './tabs/SupportTab';
import { SettingsTab } from './tabs/SettingsTab';

interface MemberDashboardProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigatePublic?: () => void;
}

type TabId = 'overview' | 'tasks' | 'wallet' | 'withdrawals' | 'team' | 'community' | 'academy' | 'ai_tools' | 'vcf' | 'bonus' | 'profile' | 'notifications' | 'support' | 'settings';

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onOpenAuth, onNavigatePublic }) => {
  const { currentUser, logout, wallet, notifications } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [activationOpen, setActivationOpen] = useState(false);
  const [activationPlan, setActivationPlan] = useState<ActivationPlan>('standard');

  // Retour en haut à chaque changement d'onglet (utile sur mobile).
  useEffect(() => { window.scrollTo({ top: 0 }); }, [activeTab]);

  if (!currentUser) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-mist p-4">
        <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center ring-1 ring-ink/10 sm:p-10">
          <BabiVector mood="wave" size={130} className="mx-auto" />
          <h2 className="mt-4 font-display text-3xl font-extrabold">Votre espace personnel</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink/65">
            Connectez-vous, ou créez gratuitement votre compte, pour retrouver votre portefeuille, vos missions et votre Académie.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Btn onClick={() => onOpenAuth?.('signup')} className="py-3.5 text-base">Créer mon compte gratuit</Btn>
            <Btn kind="ghost" onClick={() => onOpenAuth?.('login')} className="py-3.5 text-base">Se connecter</Btn>
          </div>
        </div>
      </div>
    );
  }

  const unread = notifications.filter(n => !n.read).length;
  const activate = (plan: ActivationPlan) => { setActivationPlan(plan); setActivationOpen(true); };
  const go = (id: string) => setActiveTab(id as TabId);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Accueil', icon: LayoutDashboard, group: 'Mon activité' },
    { id: 'tasks', label: 'Missions', icon: Briefcase, group: 'Mon activité' },
    { id: 'wallet', label: 'Portefeuille', icon: WalletIcon, group: 'Mon activité' },
    { id: 'withdrawals', label: 'Retraits', icon: Smartphone, group: 'Mon activité' },
    { id: 'team', label: 'Équipe et affiliation', icon: Users, group: 'Réseau' },
    { id: 'community', label: 'Communauté', icon: MessageSquare, group: 'Réseau' },
    { id: 'academy', label: 'Académie', icon: BookOpen, group: 'Apprendre' },
    { id: 'ai_tools', label: 'Outils IA', icon: Sparkles, group: 'Apprendre' },
    { id: 'vcf', label: 'Répertoires VCF', icon: FolderDown, group: 'Apprendre' },
    { id: 'bonus', label: 'Bonus', icon: Gift, group: 'Apprendre' },
    { id: 'profile', label: 'Mon profil', icon: UserIcon, group: 'Compte' },
    { id: 'notifications', label: 'Notifications', icon: Bell, group: 'Compte', badge: unread },
    { id: 'support', label: 'Support', icon: LifeBuoy, group: 'Compte' },
    { id: 'settings', label: 'Paramètres', icon: Settings, group: 'Compte' },
  ];

  return (
    <>
      <DashboardShell
        items={navItems}
        active={activeTab}
        onSelect={go}
        user={currentUser}
        balance={wallet.availableBalance}
        currency={wallet.currency}
        onWithdraw={() => setWithdrawOpen(true)}
        onNavigatePublic={onNavigatePublic}
        onLogout={logout}
        primary={['overview', 'tasks', 'wallet', 'team']}
      >
        <Banners
          onActivate={() => activate('standard')}
          onRenew={() => activate('premium')}
          showActivation={!['tasks', 'withdrawals', 'academy', 'ai_tools'].includes(activeTab)}
        />
        {activeTab === 'overview' && <OverviewTab onNavigate={go} onSelectTask={setSelectedTask} onWithdraw={() => setWithdrawOpen(true)} />}
        {activeTab === 'tasks' && <TasksTab onSelectTask={setSelectedTask} onActivate={activate} />}
        {activeTab === 'wallet' && <WalletTab onWithdraw={() => setWithdrawOpen(true)} />}
        {activeTab === 'withdrawals' && <WithdrawalsTab onWithdraw={() => setWithdrawOpen(true)} onActivate={activate} />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'community' && <CommunityTab />}
        {activeTab === 'academy' && <AcademyTab onActivate={activate} />}
        {activeTab === 'ai_tools' && <AiToolsTab onActivate={activate} />}
        {activeTab === 'vcf' && <VcfTab onActivate={activate} />}
        {activeTab === 'bonus' && <BonusTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'support' && <SupportTab onNavigate={go} />}
        {activeTab === 'settings' && <SettingsTab onRenew={() => activate('premium')} />}
      </DashboardShell>

      <WithdrawalModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <ActivationModal open={activationOpen} plan={activationPlan} onPlanChange={setActivationPlan} onClose={() => setActivationOpen(false)} />
      <TaskProofModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
};
