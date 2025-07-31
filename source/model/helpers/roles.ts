export type UserRole = 'user' | 'author' | 'admin';

export const roles = {
    type: String,
    enum: ['user', 'author', 'admin'],
    default: 'user',
} as const;