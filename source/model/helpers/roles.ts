export const enum TypeRoles{
    userRole = 'user',
    authorRole = 'author',
    adminRole = 'admin',
}

export interface IUserType {
    _role: string;
    toString: () => string;
    getRole(): string;
}

export class UserType implements IUserType {
    _role = TypeRoles.userRole;
    toString = () => '' + this._role;
    getRole() {return this._role;}
}

export class AuthorType implements IUserType {
    _role = TypeRoles.authorRole;
    toString = () => '' + this._role;
    getRole() {return this._role;}
}

export class AdminType implements IUserType {
    _role = TypeRoles.adminRole;
    toString = () => '' + this._role;
    getRole() {return this._role;}
}

export function createRoleFromString(role: string): IUserType {
    switch (role) {
        case TypeRoles.adminRole: return new AdminType();
        case TypeRoles.authorRole: return new AuthorType();
        default: return new UserType();
    }
}

export const USER_ROLE_VALUES = [new UserType().getRole(), new AuthorType().getRole(), new AdminType().getRole()] as const;