import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import Post from "../../model/entities/post.ts";
import {Types} from "mongoose";

const router = Router();

router.get('/home', async (req: Request, res: Response) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    const currentUser = await User.findById(req.session.userId).lean();
    if (!currentUser) return res.status(404).send("User not found");

    const posts = await Post.find().sort({ _id: -1 }).limit(5).lean();
    const authorIds = posts.map(post => post.author);
    const authors = await User.find({ _id: { $in: authorIds } }) .select('_id username') .lean();
    const authorMap = new Map(authors.map(author => [author._id.toString(), author.username]));

    const processedPosts = posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorName: authorMap.get(post.author.toString()),
        authorId: post.author.toString(),
        likeCount: post.likes.length
    }));

    res.render('home', {
        user: {
            id: currentUser._id.toString(),
            username: currentUser.username,
            role: currentUser.role
        },
        posts: processedPosts
    });
});

router.post('/like', async (req: Request, res: Response) => {
    const {postId} = req.body;
    const userId = req.session.userId;
    const userObjectId = new Types.ObjectId(userId);

    if (!userId) return res.status(401).send("Not authenticated");

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).send("Post not found");

        if (!post.likes.includes(userObjectId)) {
            post.likes.push(userObjectId);
            await post.save();
        }

        res.redirect('/user/home');
    } catch (err: any) {
        res.status(500).send(`Like Error: ${err.message}`);
    }
});

export default router;