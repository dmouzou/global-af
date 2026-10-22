import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  PlusCircle, 
  FileText, 
  Users, 
  Settings, 
  AlertTriangle, 
  ArrowRight,
  Send,
  Eye,
  Smartphone,
  Lock,
  LogOut,
  Building2
} from 'lucide-react';
import { TaskCategory, UserLevel } from '../../types';

interface AdminDashboardProps {
  advertiserInfo?: {
    email: string;
    companyName: string;
    role: 'admin' | 'advertiser';
  };
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  advertiserInfo,
  onLogout
}) => {
  const { 
    currentUser, 
    withdrawals, 
    processWithdrawalAdmin, 
    submissions, 
    reviewSubmissionAdmin,
    tasks,
    createTaskAdmin,
    auditLogs,
    riskAlerts,
    selectedCountry
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'finance' | 'missions' | 'ethics' | 'anti_fraud'>('finance');

  // New task form state
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('survey');
  const [taskReward, setTaskReward] = useState<number>(1000);
  const [taskQuota, setTaskQuota] = useState<number>(500);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskInst1, setTaskInst1] = useState('');
  const [taskInst2, setTaskInst2] = useState('');
  const [taskVerification, setTaskVerification] = useState<'automatic' | 'manual'>('manual');

  // Withdrawal rejection reason prompt
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDesc) return;

    createTaskAdmin({
      title: taskTitle,
      category: taskCategory,
      description: taskDesc,
      instructions: [taskInst1, taskInst2].filter(Boolean),
      rewardAmount: Number(taskReward),
      currency: selectedCountry.currency,
      quotaMax: Number(taskQuota),
      requiredLevel: 'Starter' as UserLevel,
      countries: ['CI'],
      isPremiumOnly: false,
      startDate: '2026-10-12',
      endDate: '2026-11-12',
      verificationType: taskVerification,
      status: 'published'
    });

    setIsCreatingTask(false);
    setTaskTitle('');
    setTaskDesc('');
    alert('Nouvelle mission publiée avec succès !');
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending_control' || w.status === 'approved');
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full uppercase tracking-wider">
              {advertiserInfo?.role === 'advertiser' ? 'Portail Annonceur Certifié' : 'Back-Office GLOBAL-AF'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Site : <strong className="text-emerald-400">global-af-dev-admin</strong>
            </span>
            {advertiserInfo?.email && (
              <span className="text-xs bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">
                {advertiserInfo.email}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black mt-2 tracking-tight">
            {advertiserInfo?.companyName || "Console d'Administration & Gestion Annonceurs"}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Centre de contrôle dédié aux annonceurs et administrateurs : pilotage des campagnes de micro-jobs, validation des preuves utilisateurs, suivi budgétaire et conformité éthique.
          </p>
        </div>

        {/* Right side: Annonceur Session & Logout */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-200 text-xs font-semibold transition-all hover:scale-105"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Déconnexion</span>
            </button>
          )}
        </div>
      </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveAdminTab('finance')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors ${
              activeAdminTab === 'finance' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Finances ({pendingWithdrawals.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('missions')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors ${
              activeAdminTab === 'missions' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Missions & Preuves ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('ethics')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors ${
              activeAdminTab === 'ethics' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Contrôle Éthique & Zéro Hasard
          </button>
          <button
            onClick={() => setActiveAdminTab('anti_fraud')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors ${
              activeAdminTab === 'anti_fraud' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Anti-Fraude & Audit ({riskAlerts.length})
          </button>
        </div>

      {/* FINANCE TAB */}
      {activeAdminTab === 'finance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-white tracking-tight">
                Retraits Mobile Money en attente de traitement
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                {pendingWithdrawals.length}
              </span>
            </div>
            <span className="text-xs text-slate-300 font-mono font-medium">
              Opérateurs : Wave, Orange Money, MTN MoMo, Moov Money
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                <tr>
                  <th className="px-4 py-3">ID & Date</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Opérateur & Numéro</th>
                  <th className="px-4 py-3 text-right">Montant Brut</th>
                  <th className="px-4 py-3 text-right">Net à Envoyer</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                  <th className="px-4 py-3 text-right">Actions Opérateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-slate-900">#{w.id}</div>
                      <div className="text-[10px] text-slate-400">{w.requestedAt}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{w.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{w.userPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-emerald-800">{w.operator}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{w.operatorPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">
                      {w.amount.toLocaleString()} {w.currency}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {w.netAmount.toLocaleString()} {w.currency}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        w.status === 'payout_sent' ? 'bg-emerald-100 text-emerald-800' :
                        w.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        w.status === 'pending_control' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {w.status === 'payout_sent' && 'Payé'}
                        {w.status === 'approved' && 'Approuvé'}
                        {w.status === 'pending_control' && 'En contrôle'}
                        {w.status === 'rejected' && 'Rejeté'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                      {w.status === 'pending_control' && (
                        <button
                          onClick={() => processWithdrawalAdmin(w.id, 'approve')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded"
                        >
                          Valider Contrôle
                        </button>
                      )}
                      {w.status === 'approved' && (
                        <button
                          onClick={() => processWithdrawalAdmin(w.id, 'payout')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                        >
                          Simuler Virement {w.operator}
                        </button>
                      )}
                      {(w.status === 'pending_control' || w.status === 'approved') && (
                        <button
                          onClick={() => {
                            const reason = prompt("Motif du rejet du retrait :", "Justificatifs insuffisants");
                            if (reason) processWithdrawalAdmin(w.id, 'reject', reason);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded"
                        >
                          Rejeter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MISSIONS TAB */}
      {activeAdminTab === 'missions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Validation des Participations & Création de Missions
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Vérifiez les preuves transmises par les membres pour débloquer leur rémunération.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTask(!isCreatingTask)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isCreatingTask ? 'Fermer le formulaire' : 'Créer une Nouvelle Mission'}</span>
            </button>
          </div>

          {/* Form to create mission */}
          {isCreatingTask && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Publier un nouveau micro-job</h3>
              
              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Titre de la mission</label>
                    <input
                      type="text"
                      required
                      placeholder="ex. Enquête de satisfaction réseau Orange à Bouaké"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                    <select
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="survey">Sondage</option>
                      <option value="app_test">Test d'Application</option>
                      <option value="social_visit">Visite / Sensibilisation</option>
                      <option value="content_review">Revue de Contenu</option>
                      <option value="partner_campaign">Campagne Partenaire</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rémunération par membre (XOF)</label>
                    <input
                      type="number"
                      min={200}
                      step={50}
                      value={taskReward}
                      onChange={(e) => setTaskReward(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quota maximal de participants</label>
                    <input
                      type="number"
                      min={10}
                      value={taskQuota}
                      onChange={(e) => setTaskQuota(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mode de vérification</label>
                    <select
                      value={taskVerification}
                      onChange={(e) => setTaskVerification(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="manual">Vérification manuelle (équipe)</option>
                      <option value="automatic">Automatique instantanée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description concise</label>
                  <textarea
                    rows={2}
                    required
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Présentation du micro-job..."
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Consigne 1</label>
                    <input
                      type="text"
                      placeholder="ex. Remplir le questionnaire en entier"
                      value={taskInst1}
                      onChange={(e) => setTaskInst1(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Consigne 2</label>
                    <input
                      type="text"
                      placeholder="ex. Copier le code de fin dans le formulaire"
                      value={taskInst2}
                      onChange={(e) => setTaskInst2(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTask(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                  >
                    Publier la Mission
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Pending Submissions to Review */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Preuves soumises par les membres ({submissions.length})
            </h3>

            <div className="space-y-3">
              {submissions.map(sub => (
                <div key={sub.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sub.taskTitle}</span>
                      <span className="text-[10px] text-slate-500 font-mono">#{sub.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Par : <strong>{sub.userName}</strong> ({sub.submittedAt})
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-700 font-mono text-[11px]">
                      {sub.proofContent}
                    </div>
                    {sub.feedback && (
                      <div className="text-[11px] text-emerald-700">Retour : {sub.feedback}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-700">+{sub.rewardAmount} XOF</div>
                      <span className={`text-[10px] font-semibold ${
                        sub.status === 'approved' ? 'text-emerald-700' :
                        sub.status === 'rejected' ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        {sub.status === 'approved' && 'Validé & Crédité'}
                        {sub.status === 'rejected' && 'Refusé'}
                        {sub.status === 'pending' && 'En attente de revue'}
                      </span>
                    </div>

                    {sub.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => reviewSubmissionAdmin(sub.id, 'approved', 'Preuve conforme.')}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => reviewSubmissionAdmin(sub.id, 'rejected', 'Justificatif non valide.')}
                          className="px-2 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded"
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ETHICS TAB */}
      {activeAdminTab === 'ethics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight">
            Contrôle & Invariants Éthiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">
                Règle 1 : Ventes réelles uniquement (Anti-Ponzi)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Le système bloque algorithmiquement toute attribution de commission sur l'adhésion simple d'un membre. Les commissions ne sont déclenchées que par l'achat d'un bien identifiable (Académie ou Pack Partenaire).
              </p>
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 font-semibold">
                ✓ Statut invariant : Actif (Niveau 1 : 15%, Niveau 2 : 5%, Niveau 3 : Verrouillé désactivé).
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">
                Règle 4 : Interdiction Absolue des Jeux de Hasard
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Conformément à la section 15 & 39, toute roulette, tombola, boîte mystère ou tirage probabiliste est bannie du code de l'application. Seules les récompenses déterministes et fixes sont autorisées.
              </p>
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 font-semibold">
                ✓ Statut invariant : Conforme (0 composant aléatoire).
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ANTI-FRAUD & AUDIT LOG TAB */}
      {activeAdminTab === 'anti_fraud' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight">
            Détection Anti-Fraude & Journal d'Audit Immuable
          </h2>

          {/* Risk alerts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Alertes Comportementales ({riskAlerts.length})</span>
            </h3>

            <div className="space-y-2">
              {riskAlerts.map(alert => (
                <div key={alert.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
                      {alert.type} · Sévérité : {alert.severity}
                    </div>
                    <p>{alert.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Log */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Journal d'Audit des Actions Sensibles ({auditLogs.length})
            </h3>

            <div className="space-y-2">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                  {log.complianceRule && (
                    <div className="text-[10px] text-emerald-700 font-medium font-mono">
                      Règle : {log.complianceRule}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
