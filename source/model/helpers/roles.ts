const userRole = 'user';
const authorRole = 'author';
const adminRole = 'admin';

export interface IUserType {
    role: string;
    getRole(): string;
}

export class UserType implements IUserType {
    role = userRole;
    getRole() {return this.role;}
}

export class AuthorType implements IUserType {
    role = authorRole;
    getRole() {return this.role;}
}

export class AdminType implements IUserType {
    role = adminRole;
    getRole() {return this.role;}
}

export function createRoleFromString(role: string): IUserType {
    switch (role) {
        case adminRole: return new AdminType();
        case authorRole: return new AuthorType();
        default: return new UserType();
    }
}

export const USER_ROLE_VALUES = [new UserType().getRole(), new AuthorType().getRole(), new AdminType().getRole()] as const;