import {Router, Request, Response} from "express";
import Post, {IPost} from "../../model/entities/post.ts";
import {Validator} from "../../utiles/validator.ts";
import {AuthorType} from "../../model/helpers/roles.ts";
import {AuthenticatedCheck, PostExistsCheck, UserExistsByIdCheck, UserRoleValidCheck, UserIsAuthorOfPostCheck, UserIsAuthorOfPostOrAdminCheck} from "../../utiles/validationSteps/validationConfig.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";
import {PostDBUnit} from "../../model/dbUnits/postUnit.ts";
import {SafeRunner} from "../../utiles/safeRunner.ts";
import {IUser} from "../../model/entities/user.ts";

const router = Router();

router.get('/createPost', (req: Request, res: Response) => {
    res.render('createPost');
});

router.post('/createPost', async (req: Request, res: Response) => {
    const routerURL = "POST /author/createPost";
    const {title, content} = req.body;
    const userId = req.session.userId;
    
    const validator = new Validator(res, routerURL)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId))
            .addStep(new UserRoleValidCheck(userId as string, new AuthorType().getRole()));

    if (!(await validator.run())) return;

    const user = await UserDBUnit.findById(userId as string) as IUser;
    const newPost = new Post({
            title:   [title],
            content: [content],
            version: 0,
            author:  user.id,
            likes:   []
        });

    const safeRunner = new SafeRunner(res, routerURL);
    await safeRunner.safeExecute(async () => {
        await PostDBUnit.create(newPost);
    });
});

router.get('/editPost', async (req: Request, res: Response) => {
    const routerURL = "GET /author/editPost";
    const userId = req.session.userId;
    const {postId} = req.query as {postId?: string};

    const validator = new Validator(res, routerURL)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId))
            .addStep(new UserRoleValidCheck(userId as string, new AuthorType().getRole()))
            .addStep(new PostExistsCheck(postId))
            .addStep(new UserIsAuthorOfPostCheck(userId as string, postId as string));

    if (!(await validator.run())) return;

    const post = await PostDBUnit.findById(postId as string) as IPost;
    const currentTitle = post.title[post.version];
    const currentContent = post.content[post.version];

    res.render('editPost', {
        post: {
            id: post.id,
            version: post.version
        },
        currentTitle,
        currentContent
    });
});

router.post('/editPost', async (req: Request, res: Response) => {
    const routerURL = "Post /author/editPost";
    const userId = req.session.userId;
    const {postId, title, content} = req.body as {postId?: string; title: string; content: string;};

    const validator = new Validator(res, routerURL)
            .addStep(new AuthenticatedCheck(userId))
            .addStep(new UserExistsByIdCheck(userId))
            .addStep(new UserRoleValidCheck(userId as string, new AuthorType().getRole()))
            .addStep(new PostExistsCheck(postId))
            .addStep(new UserIsAuthorOfPostCheck(userId as string, postId as string));

    if (!(await validator.run())) return;

    const safeRunner = new SafeRunner(res, routerURL);
    await safeRunner.safeExecute(async () => {
        await PostDBUnit.appendRevision(postId as string, userId as string, title, content);
    });
});

router.get('/versions', async (req: Request, res: Response) => {
    const routerURL = "GET /author/versions";
    const userId = req.session.userId;
    const {postId} = req.query as {postId?: string};

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new UserExistsByIdCheck(userId))
        .addStep(new PostExistsCheck(postId))
        .addStep(new UserIsAuthorOfPostOrAdminCheck(userId as string, postId as string));

    if (!(await validator.run())) return;

    const safeRunner = new SafeRunner(res, routerURL);
    await safeRunner.safeExecute(async () => {
        const post = await PostDBUnit.findById(postId as string) as IPost;
        res.render('versions', {post});
    });
});

router.post('/swapVersion', async (req: Request, res: Response) => {
    const routeURL = "POST /author/swapVersion";
    const userId = req.session.userId;
    const {postId, versionIndex} = req.body as {postId?: string; versionIndex: string};

    const validator = new Validator(res, routeURL)
        .addStep(new AuthenticatedCheck(userId))
        .addStep(new UserExistsByIdCheck(userId))
        .addStep(new PostExistsCheck(postId))
        .addStep(new UserIsAuthorOfPostOrAdminCheck(userId as string, postId as string));

    if (!(await validator.run())) return;

    const safeRunner = new SafeRunner(res, routeURL);
    await safeRunner.safeExecute(async () => {
        await PostDBUnit.swapVersion(postId as string, Number(versionIndex));
        res.redirect('/user/home');
    });
});

export default router;