export type UserRole = 'guest' | 'participant' | 'captain' | 'judge' | 'admin';

export interface RolePermissions {
  canCreateTeam: boolean;
  canManageTeam: boolean;
  canRegisterTeam: boolean;
  canAccessJudging: boolean;
  canAccessAdmin: boolean;
  canViewProfiles: boolean;
}

export const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case 'admin':
      return {
        canCreateTeam: true,
        canManageTeam: true,
        canRegisterTeam: true,
        canAccessJudging: true,
        canAccessAdmin: true,
        canViewProfiles: true,
      };
    case 'judge':
      return {
        canCreateTeam: false,
        canManageTeam: false,
        canRegisterTeam: false,
        canAccessJudging: true,
        canAccessAdmin: false,
        canViewProfiles: true,
      };
    case 'captain':
      return {
        canCreateTeam: true,
        canManageTeam: true,
        canRegisterTeam: true,
        canAccessJudging: false,
        canAccessAdmin: false,
        canViewProfiles: true,
      };
    case 'participant':
      return {
        canCreateTeam: false,
        canManageTeam: false,
        canRegisterTeam: false,
        canAccessJudging: false,
        canAccessAdmin: false,
        canViewProfiles: true,
      };
    case 'guest':
    default:
      return {
        canCreateTeam: false,
        canManageTeam: false,
        canRegisterTeam: false,
        canAccessJudging: false,
        canAccessAdmin: false,
        canViewProfiles: false,
      };
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Адміністратор';
    case 'judge':
      return 'Суддя';
    case 'captain':
      return 'Капітан команди';
    case 'participant':
      return 'Учасник';
    case 'guest':
      return 'Гість';
    default:
      return 'Гість';
  }
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-500';
    case 'judge':
      return 'bg-purple-500';
    case 'captain':
      return 'bg-blue-500';
    case 'participant':
      return 'bg-green-500';
    case 'guest':
    default:
      return 'bg-gray-500';
  }
};