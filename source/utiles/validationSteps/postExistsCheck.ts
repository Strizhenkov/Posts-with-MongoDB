import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import Post from "../../model/entities/post.ts";

export class PostExistsCheck implements IValidationStep {
    constructor(private postId: string | undefined | null) {}

    async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const post = await Post.findById(this.postId);
        if (!post) {
            errorHandler.handle(res, 404, route, "Post not found");
            return false;
        }
        return true;
    }
}