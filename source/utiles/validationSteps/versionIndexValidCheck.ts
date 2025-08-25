import {PostDBUnit} from '../../model/dbUnits/postUnit.ts';
import type {ErrorHandler} from '../errorHandler.ts';
import type {IValidationStep} from './iValidationStep.ts';
import type {IPost} from '../../model/entities/post.ts';
import type {Response} from 'express';

export class VersionIndexValidCheck implements IValidationStep {
    constructor(private postId: string, private versionIndex: number) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const post = await PostDBUnit.findById(this.postId) as IPost;

        if (!Number.isInteger(this.versionIndex)) {
            errorHandler.handle(res, 400, route, 'Version index must be an integer');
            return false;
        }

        const max = Math.min(post.title.length, post.content.length) - 1;
        if (this.versionIndex < 0 || this.versionIndex > max) {
            errorHandler.handle(res, 404, route, `Version ${this.versionIndex} not found`);
            return false;
        }

        return true;
    }
}