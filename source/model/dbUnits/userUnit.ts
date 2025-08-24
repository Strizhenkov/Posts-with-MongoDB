import {Types} from 'mongoose';
import User from '../entities/user.ts';
import {DBUnit} from './dbUnit.ts';
import type {IUser} from '../entities/user.ts';

export class UserUnit extends DBUnit<IUser> {
    constructor() {
        super(User);
    }

    public async findByUsername(username: string) {
        return this.model.findOne({username});
    }

    private normalizeRole(user: IUser): void {
        if (typeof user.role === 'string') {
            return;
        }

        const roleWithMethod = user.role as Partial<{getRole: () => string}>;
        if (roleWithMethod.getRole && typeof roleWithMethod.getRole === 'function') {
            user.role = roleWithMethod.getRole();
            return;
        }

        const roleWithValue = user.role as Partial<{value: string}>;
        if (typeof roleWithValue.value === 'string') {
            user.role = roleWithValue.value;
            return;
        }

        user.role = String(user.role);
    }

    public async subscribe(userId: string, authorId: string) : Promise<IUser | null>  {
        const user = await this.findById(userId);
        if (!user) return null;

        const authorObjId = new Types.ObjectId(authorId);

        if (!user.subscriptions.some((id: Types.ObjectId) => id.equals(authorObjId))) {
            user.subscriptions.push(authorObjId);
            this.normalizeRole(user);
            await user.save();
        }
        return user;
    }

    public async unsubscribe(userId: string, authorId: string) : Promise<IUser | null> {
        const user = await this.findById(userId);
        if (!user) return null;

        const authorObjId = new Types.ObjectId(authorId);
        user.subscriptions = user.subscriptions.filter((id: Types.ObjectId) => !id.equals(authorObjId));
        this.normalizeRole(user);
        await user.save();
        return user;
    }

    public async isSubscribed(userId: string, authorId: string) : Promise<boolean>  {
        const user = await this.findById(userId);
        if (!user) return false;

        const authorObjId = new Types.ObjectId(authorId);
        return user.subscriptions.some((id: Types.ObjectId) => id.equals(authorObjId));
    }
}

export const UserDBUnit = new UserUnit();