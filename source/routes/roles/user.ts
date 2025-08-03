import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import Post from "../../model/entities/post.ts";
import {Types} from "mongoose";
import {Validator} from "../../utiles/validator.ts";

const router = Router();

router.get('/home', async (req: Request, res: Response) => {
    const routerURL = "GET /user/home";
    const userId = req.session.userId;
    
    if (!(await Validator.authenticatedCheck(res, userId, routerURL))) return;
    if (!(await Validator.userExistsCheckById(res, userId, routerURL))) return;

    const user = await User.findById(userId).lean();
    const posts = await Post.find().sort({_id: -1}).limit(5).lean();
    const authorIds = posts.map(post => post.author);
    const authors = await User.find({_id: {$in: authorIds}}) .select('_id username') .lean();
    const authorMap = new Map(authors.map(author => [author._id.toString(), author.username]));

    const processedPosts = posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorName: authorMap.get(post.author.toString()),
        authorId: post.author.toString(),
        likeCount: post.likes.length,
        isSubscribed: user!.subscriptions.some(sub => sub.toString() === post.author.toString())
    }));

    res.render('home', {
        user: {
            id: user!._id.toString(),
            username: user!.username,
            role: user!.role
        },
        posts: processedPosts
    });
});

router.post('/like', async (req: Request, res: Response) => {
    const routerURL = "GET /user/like";
    const {postId} = req.body;
    const userId = req.session.userId;
    const userObjectId = new Types.ObjectId(userId);

    if (!(await Validator.authenticatedCheck(res, userId, routerURL))) return;
    if (!(await Validator.postExistsCheck(res, postId, routerURL))) return;
    
    const post = await Post.findById(postId);

    await Validator.safe(res, routerURL, async () => {
        if (!post!.likes.includes(userObjectId)) {
            post!.likes.push(userObjectId);
            await post!.save();
        }
        res.redirect('/user/home');
    });
});

router.post('/subscribe', async (req: Request, res: Response) => {
    const routerURL = "GET /user/subscribe";
    const userId = req.session.userId;
    const {authorId} = req.body;

    if (!(await Validator.authenticatedCheck(res, userId, routerURL))) return;
    if (!(await Validator.userExistsCheckById(res, userId, routerURL))) return;
    if (!(await Validator.userRoleValidCheck(res, authorId, 'author', routerURL))) return;

    const user = await User.findById(userId);
    const authorObjectId = new Types.ObjectId(authorId);

    await Validator.safe(res, routerURL, async () => {
        if (!user!.subscriptions.includes(authorObjectId)) {
            user!.subscriptions.push(authorObjectId);
            await user!.save();
        }
        res.redirect('/user/home');
    });
});

router.post('/unsubscribe', async (req: Request, res: Response) => {
    const routerURL = "POST /user/unsubscribe";
    const userId = req.session.userId;
    const {authorId} = req.body;

    if (!(await Validator.authenticatedCheck(res, userId, routerURL))) return;
    if (!(await Validator.userExistsCheckById(res, userId, routerURL))) return;
    if (!(await Validator.userRoleValidCheck(res, authorId, 'author', routerURL))) return;

    const user = await User.findById(userId);
    const authorObjectId = new Types.ObjectId(authorId);

    await Validator.safe(res, routerURL, async () => {
        const index = user!.subscriptions.findIndex(id => id.equals(authorObjectId));
        if (index !== -1) {
            user!.subscriptions.splice(index, 1);
            await user!.save();
        }
        res.redirect('/user/home');
    });
});

export default router;