import {PostDBUnit} from '../../model/dbUnits/postUnit.ts';
import {UserDBUnit} from '../../model/dbUnits/userUnit.ts';
import {AdminType} from '../../model/helpers/roles.ts';
import type {IPost} from '../../model/entities/post.ts';
import type {IUser} from '../../model/entities/user.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {Response} from 'express';

export class UserIsAuthorOfPostOrAdminCheck implements IValidationStep {
    constructor(private userId: string, private postId: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findById(this.userId) as IUser;
        const post = await PostDBUnit.findById(this.postId) as IPost;

        const isAdmin = user.role === new AdminType().getRole().toString();
        const isOwner = post.author.toString() === user.id.toString();

        if (!isAdmin && !isOwner) {
            errorHandler.handle(res, 403, route, 'Forbidden: not post owner or admin');
            return false;
        }
        return true;
    }
}