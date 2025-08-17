import {Response} from "express";
import {ErrorHandler} from "../errorHandler.ts";
import {IValidationStep} from "./iValidationStep.ts";
import {PostDBUnit} from "../../model/dbUnits/postUnit.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";
import {IUser} from "../../model/entities/user.ts";
import {IPost} from "../../model/entities/post.ts";
import {AdminType} from "../../model/helpers/roles.ts";

export class UserIsAuthorOfPostOrAdminCheck implements IValidationStep {
    constructor(private userId: string, private postId: string) {}

    async execute(res: Response, route: string, errorHandler: ErrorHandler): Promise<boolean> {
        const user = await UserDBUnit.findById(this.userId) as IUser;
        const post = await PostDBUnit.findById(this.postId) as IPost;

        const isAdmin = user.role === new AdminType().getRole().toString();
        const isOwner = post.author.toString() === user.id.toString();
        
        if (!isAdmin && !isOwner) {
            errorHandler.handle(res, 403, route, "Forbidden: not post owner or admin");
            return false;
        }
        return true;
    }
}