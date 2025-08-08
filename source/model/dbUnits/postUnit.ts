import {Types} from "mongoose";
import Post, {IPost} from "../entities/post.ts";
import {DBUnit} from "./dbUnit.ts";

export class PostUnit extends DBUnit<IPost> {
    public constructor() {
        super(Post);
    }
    
    public async findRecent(limit = 5): Promise<IPost[]> {
        return await  Post.find().sort({_id: -1}).limit(limit);
    }

    public async like(postId: string, userId: string) : Promise<IPost | null>  {
        const post = await this.findById(postId);
        if (!post) return null;

        const userObjId = new Types.ObjectId(userId);
        if (!post.likes.some((id: Types.ObjectId) => id.equals(userObjId))) {
            post.likes.push(userObjId);
            await post.save();
        }
        return post;
    }

    public async unlike(postId: string, userId: string) : Promise<IPost | null>  {
        const post = await this.findById(postId);
        if (!post) return null;

        const userObjId = new Types.ObjectId(userId);
        post.likes = post.likes.filter((id: Types.ObjectId) => !id.equals(userObjId));
        await post.save();
        return post;
    }
}

export const PostDBUnit = new PostUnit();