/** Contant Primitieves */
export const SALT_ROUNDS = 8;

export const ACCESS_TOKEN = 'access-token';
export const RESET_TOKEN = 'reset-token';
export const SESSION_EXPIRATION = '24h';

/** Enums */
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum AuthStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
