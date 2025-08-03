import {Response} from 'express';
import User from '../model/entities/user.ts';
import Post from '../model/entities/post.ts';
import {ErrorHandler} from './errorHandler.ts';

export class Validator {
    static async passwordMatchCheck(res: Response, username: string | undefined | null, password: string, route: string): Promise<true | void> {
        const user = await User.findOne({username});
        const match = await user!.comparePassword(password);
        if (!match) {
            return ErrorHandler.handle(res, 400, route, "Wrong username or password");
        }
        return true;
    }

    static async authenticatedCheck(res: Response, userId: string | undefined | null, route: string): Promise<true | void> {
        if (!userId) {
            return ErrorHandler.handle(res, 401, route, "Not authenticated");
        }
        return true;
    }

    static async userExistsCheckById(res: Response, userId: string | undefined | null, route: string): Promise<true | void> {
        const user = await User.findById(userId);
        if (!user) {
            return ErrorHandler.handle(res, 404, route, "User not found");
        }
        return true;
    }

    static async userExistsCheckByName(res: Response, username: string | undefined | null, route: string): Promise<true | void> {
        const user = await User.findOne({username});
        if (!user) {
            return ErrorHandler.handle(res, 404, route, "User not found");
        }
        return true;
    }

    static async userRoleValidCheck(res: Response, userId: string | undefined | null, requiredRole: string, route: string): Promise<true | void> {
        const user = await User.findById(userId);
        if (!user) {
            return ErrorHandler.handle(res, 404, route, "User not found");
        }
        if (user.role !== requiredRole) {
            return ErrorHandler.handle(res, 403, route, `User is not an ${requiredRole}`);
        }
        return true;
    }

    static async postExistsCheck(res: Response, postId: string | undefined | null, route: string): Promise<true | void> {
        const post = await Post.findById(postId);
        if (!post) {
            return ErrorHandler.handle(res, 404, route, "Post not found");
        }
        return true;
    }

    static async safe<T>(res: Response, route: string, action: () => Promise<T>): Promise<T | void> {
        try {
            return await action();
        } catch (err: any) {
            ErrorHandler.handle(res, 500, route, err.message);
        }
    }
}