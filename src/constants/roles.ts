export enum ROLES {
  PESERTA = "peserta",
  ADMIN = "admin",
}

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
