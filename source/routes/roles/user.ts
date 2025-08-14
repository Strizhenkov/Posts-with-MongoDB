import {Router, Request, Response} from "express";
import {IUser} from "../../model/entities/user.ts";
import {Validator} from "../../utiles/validator.ts";
import {AuthorType} from "../../model/helpers/roles.ts";
import {AuthenticatedCheck} from "../../utiles/validationSteps/authenticatedCheck.ts";
import {UserExistsByIdCheck} from "../../utiles/validationSteps/userExistsByIdCheck.ts";
import {UserRoleValidCheck} from "../../utiles/validationSteps/userRoleValidCheck.ts";
import {PostExistsCheck} from "../../utiles/validationSteps/postExistsCheck.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";
import {PostDBUnit} from "../../model/dbUnits/postUnit.ts";
import {IPost} from "../../model/entities/post.ts";

const router = Router();

router.get('/home', async (req: Request, res: Response) => {
    const routerURL = "GET /user/home";
    const userId = req.session.userId;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new UserExistsByIdCheck(userId));

    if (!(await validator.run())) return;

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
        const isLiked = post.likes.some((id: any) => id.toString() === currentUserId);
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            authorName: authorMap.get(authorId),
            authorId,
            likeCount: post.likes.length,
            isSubscribed: user.subscriptions.some(sub => sub.toString() === authorId),
            isLiked
        };
    };

    res.render("home", {
        user: {id: user.id.toString(), username: user.username, role: user.role},
        postsAll: postsAll.map(mapPost),
        postsSubs: postsSubs.map(mapPost),
    });
});

router.post('/like', async (req: Request, res: Response) => {
    const routerURL = "GET /user/like";
    const {postId} = req.body;
    const userId = req.session.userId;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new PostExistsCheck(postId))

    if (!(await validator.run())) return;

    await validator.safeExecute(async () => {
        await PostDBUnit.like(postId as string, userId as string);
        res.redirect('/user/home');
    });
});

router.post('/unlike', async (req: Request, res: Response) => {
    const routerURL = "POST /user/unlike";
    const {postId} = req.body;
    const userId = req.session.userId;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new PostExistsCheck(postId));

    if (!(await validator.run())) return;

    await validator.safeExecute(async () => {
        await PostDBUnit.unlike(postId as string, userId as string);
        res.redirect('/user/home');
    });
});

router.post('/subscribe', async (req: Request, res: Response) => {
    const routerURL = "GET /user/subscribe";
    const userId = req.session.userId;
    const {authorId} = req.body;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new UserExistsByIdCheck(userId))
        .addStep(new UserRoleValidCheck(authorId, new AuthorType().getRole()));
        
    if (!(await validator.run())) return;

    await validator.safeExecute(async () => {
        await UserDBUnit.subscribe(userId as string, authorId as string)
        res.redirect('/user/home');
    });
});

router.post('/unsubscribe', async (req: Request, res: Response) => {
    const routerURL = "POST /user/unsubscribe";
    const userId = req.session.userId;
    const {authorId} = req.body;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new UserExistsByIdCheck(userId))
        .addStep(new UserRoleValidCheck(authorId, new AuthorType().getRole()));

    if (!(await validator.run())) return;

    await validator.safeExecute(async () => {
        await UserDBUnit.unsubscribe(userId as string, authorId as string);
        res.redirect('/user/home');
    });
});

export default router;