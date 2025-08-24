import {PostDBUnit} from '../../model/dbUnits/postUnit.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {IPost} from '../../model/entities/post.ts';
import type {Response} from 'express';

export class UserIsAuthorOfPostCheck implements IValidationStep {
    constructor(private userId: string, private postId: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const post = await PostDBUnit.findById(this.postId) as IPost;

        if (post.author.toString() !== this.userId) {
            errorHandler.handle(res, 403, route, 'User is not the author of this post');
            return false;
        }
        return true;
    }
}