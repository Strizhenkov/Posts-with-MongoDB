export const enum TypeRoles {
    userRole = 'user',
    authorRole = 'author',
    adminRole = 'admin',
}

export interface IUserType {
    toString: () => string;
    getRole(): string;
}

export class UserType implements IUserType {
    protected _role = TypeRoles.userRole;
    public toString = () => '' + this._role;
    public getRole() {return this._role;}
}

export class AuthorType implements IUserType {
    protected _role = TypeRoles.authorRole;
    public toString = () => '' + this._role;
    public getRole() {return this._role;}
}

export class AdminType implements IUserType {
    protected _role = TypeRoles.adminRole;
    public toString = () => '' + this._role;
    public getRole() {return this._role;}
}

export function createRoleFromString(role: string): IUserType {
    switch (role) {
    case TypeRoles.adminRole:
        return new AdminType();
    case TypeRoles.authorRole:
        return new AuthorType();
    default:
        return new UserType();
    }
}

export const USER_ROLE_VALUES = [new UserType().getRole(), new AuthorType().getRole(), new AdminType().getRole()] as const;