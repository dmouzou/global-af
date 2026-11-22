import { UserRole } from '../types';

/** Rôles autorisés à entrer dans la console (section 3 du cahier des charges). */
export const STAFF_ROLES: UserRole[] = ['moderator', 'support', 'financial_manager', 'content_manager', 'admin', 'super_admin'];

export const ROLE_LABEL: Record<UserRole, string> = {
  member: 'Membre',
  member_premium: 'Membre Premium',
  moderator: 'Modérateur',
  support: 'Support',
  financial_manager: 'Gestionnaire financier',
  content_manager: 'Gestionnaire de contenu',
  admin: 'Administrateur',
  super_admin: 'Super administrateur',
};

export const ROLE_RANK: Record<UserRole, number> = {
  member: 0, member_premium: 0, moderator: 1, support: 1, financial_manager: 1, content_manager: 1, admin: 2, super_admin: 3,
};

const has = (list: UserRole[], r?: UserRole) => !!r && list.includes(r);
export const can = {
  staff: (r?: UserRole) => has(STAFF_ROLES, r),
  finance: (r?: UserRole) => has(['financial_manager', 'admin', 'super_admin'], r),
  content: (r?: UserRole) => has(['content_manager', 'admin', 'super_admin'], r),
  moderation: (r?: UserRole) => has(['moderator', 'content_manager', 'admin', 'super_admin'], r),
  support: (r?: UserRole) => has(['support', 'admin', 'super_admin'], r),
  admin: (r?: UserRole) => has(['admin', 'super_admin'], r),
  superAdmin: (r?: UserRole) => r === 'super_admin',
};
