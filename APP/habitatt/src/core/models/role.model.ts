export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    PROFESIONAL = 'PROFESIONAL',
}

export interface RoleOption {
    value: Role;
    label: string;
}

export const ROLE_OPTIONS: Record<Role, RoleOption> = {
  [Role.ADMIN]: { value: Role.ADMIN, label: 'Administrador' },
  [Role.USER]: { value: Role.USER, label: 'Usuario' },
  [Role.PROFESIONAL]: { value: Role.PROFESIONAL, label: 'Profesional' },
};