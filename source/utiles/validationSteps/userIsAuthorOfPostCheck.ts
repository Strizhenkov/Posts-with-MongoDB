import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import {PostDBUnit} from "../../model/dbUnits/postUnit.ts";
import {IPost} from "../../model/entities/post.ts";

export class UserIsAuthorOfPostCheck implements IValidationStep {
    public constructor(private userId: string, private postId: string) {}

    public async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const post = await PostDBUnit.findById(this.postId) as IPost;
        if (post.author.toString() !== this.userId) {
            errorHandler.handle(res, 403, route, "User is not the author of this post");
            return false;
        }
        return true;
    }
}