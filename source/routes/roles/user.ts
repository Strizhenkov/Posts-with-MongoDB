import {Router} from 'express';
import {PostDBUnit} from '../../model/dbUnits/postUnit.ts';
import {UserDBUnit} from '../../model/dbUnits/userUnit.ts';
import {AuthorType} from '../../model/helpers/roles.ts';
import {SafeRunner} from '../../utiles/safeRunner.ts';
import {AuthenticatedCheck, UserRoleValidCheck, UserExistsByIdCheck, PostExistsCheck} from '../../utiles/validationSteps/validationConfig.ts';
import {Validator} from '../../utiles/validator.ts';
import type {IPost} from '../../model/entities/post.ts';
import type {IUser} from '../../model/entities/user.ts';
import type {Logger} from '../../utiles/logger.ts';
import type {Request, Response} from 'express';
import type {Types} from 'mongoose';

export default function createUserRoutes(logger: Logger) {
    const router = Router();

    router.get('/home', async (req: Request, res: Response) => {
        const routerURL = 'GET /user/home';
        const userId = req.session.userId;

        const validator = new Validator(res, routerURL, logger)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId));

        if (!(await validator.run())) {return;}

        const user = await UserDBUnit.findById(userId as string) as IUser;
        const postsAll = await PostDBUnit.findRecent(5);

        const subscribedAuthorIds = user.subscriptions.map(id => id.toString());
        const postsSubs = await PostDBUnit.findRecentByAuthors(subscribedAuthorIds, 5);

        const allAuthorIds = Array.from(new Set([...postsAll.map(p => p.author.toString()), ...postsSubs.map(p => p.author.toString())]));
        const authorDocs = await Promise.all(allAuthorIds.map(id => UserDBUnit.findById(id)));
        const authorMap = new Map(authorDocs.filter((a): a is NonNullable<typeof a> => Boolean(a)).map(a => [a.id.toString() as string, a.username]));

        const currentUserId = user.id.toString();
        const mapPost = (post: IPost) => {
            const authorId = post.author.toString();
            const isLiked = post.likes.some((id: Types.ObjectId) => id.toString() === currentUserId);
            return {
                id: post.id,
                title: post.title[post.version],
                content: post.content[post.version],
                versionCount: post.title.length,
                authorName: authorMap.get(authorId),
                authorId,
                likeCount: post.likes.length,
                isSubscribed: user.subscriptions.some(sub => sub.toString() === authorId),
                isLiked
            };
        };

        res.render('home', {
            user: {id: user.id.toString(), username: user.username, role: user.role},
            postsAll: postsAll.map(mapPost),
            postsSubs: postsSubs.map(mapPost)
        });
    });

    router.get('/profile', async (req: Request, res: Response) => {
        const route = 'GET /user/profile';
        const userId = req.session.userId;

        const validator = new Validator(res, route, logger)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId));

        if (!(await validator.run())) {return;}

        const user = await UserDBUnit.findById(userId as string) as IUser;
        const myPostsRaw = user.role === new AuthorType().getRole() ? await PostDBUnit.getAllByAuthor(user.id.toString()) : [];

        const mapPost = (post: IPost) => {
            const isLiked = post.likes.some((id: Types.ObjectId) => id.toString() === userId);
            return {
                id: post.id,
                title: post.title[post.version],
                content: post.content[post.version],
                versionCount: post.title.length,
                authorName: user.username,
                authorId: user.id.toString(),
                likeCount: post.likes.length,
                isSubscribed: true,
                isLiked
            };
        };

        res.render('profile', {
            user: {id: user.id.toString(), username: user.username, role: user.role},
            myPosts: myPostsRaw.map(mapPost)
        });
    });

    router.post('/like', async (req: Request, res: Response) => {
        const routerURL = 'GET /user/like';
        const {postId} = req.body;
        const userId = req.session.userId;

        const validator = new Validator(res, routerURL, logger)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new PostExistsCheck(postId));

        if (!(await validator.run())) {return;}

        const safeRunner = new SafeRunner(res, routerURL, logger);
        await safeRunner.safeExecute(async () => {
            await PostDBUnit.like(postId as string, userId as string);
            res.redirect('/user/home');
        });
    });

    router.post('/unlike', async (req: Request, res: Response) => {
        const routerURL = 'POST /user/unlike';
        const {postId} = req.body;
        const userId = req.session.userId;

        const validator = new Validator(res, routerURL, logger)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new PostExistsCheck(postId));

        if (!(await validator.run())) {return;}

        const safeRunner = new SafeRunner(res, routerURL, logger);
        await safeRunner.safeExecute(async () => {
            await PostDBUnit.unlike(postId as string, userId as string);
            res.redirect('/user/home');
        });
    });

    router.post('/subscribe', async (req: Request, res: Response) => {
        const routerURL = 'GET /user/subscribe';
        const userId = req.session.userId;
        const {authorId} = req.body;

        const validator = new Validator(res, routerURL, logger)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId))
            .addStep(new UserRoleValidCheck(authorId, new AuthorType().getRole()));

        if (!(await validator.run())) {return;}

        const safeRunner = new SafeRunner(res, routerURL, logger);
        await safeRunner.safeExecute(async () => {
            await UserDBUnit.subscribe(userId as string, authorId as string);
            res.redirect('/user/home');
        });
    });

    router.post('/unsubscribe', async (req: Request, res: Response) => {
        const routerURL = 'POST /user/unsubscribe';
        const userId = req.session.userId;
        const {authorId} = req.body;

        const validator = new Validator(res, routerURL, logger)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId))
            .addStep(new UserRoleValidCheck(authorId, new AuthorType().getRole()));

        if (!(await validator.run())) {return;}

        const safeRunner = new SafeRunner(res, routerURL, logger);
        await safeRunner.safeExecute(async () => {
            await UserDBUnit.unsubscribe(userId as string, authorId as string);
            res.redirect('/user/home');
        });
    });

    return router;
}