
import {PostDBUnit} from '../../model/dbUnits/postUnit.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {Response} from 'express';

export class PostExistsCheck implements IValidationStep {
    constructor(private postId: string | undefined) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        if (this.postId == undefined) {
            errorHandler.handle(res, 400, route, 'Uncorrect postId');
            return false;
        }

        const post = await PostDBUnit.findById(this.postId);

        if (!post) {
            errorHandler.handle(res, 404, route, 'Post not found');
            return false;
        }
        return true;
    }
}