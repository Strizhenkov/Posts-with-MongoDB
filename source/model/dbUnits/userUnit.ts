import {Types} from "mongoose";
import User, {IUser} from "../entities/user.ts";
import {DBUnit} from "./dbUnit.ts";

export class UserUnit extends DBUnit<IUser> {
    public constructor() {
        super(User);
    }

    public async findByUsername(username: string) {
        return this.model.findOne({username});
    }

    private normalizeRole(user: IUser): void {
        if (typeof user.role === "string") return;
        const anyRole = user.role as any;
        if (anyRole?.getRole && typeof anyRole.getRole === "function") {
            user.role = anyRole.getRole();
        } else if (typeof anyRole?.value === "string") {
            user.role = anyRole.value;
        } else {
            user.role = String(anyRole);
        }
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