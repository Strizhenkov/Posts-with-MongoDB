import {Router, Request, Response} from "express";
import Post from "../../model/entities/post.ts";
import {Validator} from "../../utiles/validator.ts";
import {AuthorType} from "../../model/helpers/roles.ts";
import {AuthenticatedCheck, UserRoleValidCheck} from "../../utiles/validationSteps/validationConfig.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";
import {PostDBUnit} from "../../model/dbUnits/postUnit.ts";
import {SafeRunner} from "../../utiles/safeRunner.ts";

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
            .addStep(new UserRoleValidCheck(userId, new AuthorType().getRole()));

    if (!(await validator.run())) return;

    const user = await UserDBUnit.findById(userId as string);
    const newPost = new Post({title, content, author: user!._id, likes: []});

    const safeRunner = new SafeRunner(res, routerURL);
    await safeRunner.safeExecute(async () => {
        await PostDBUnit.create(newPost);
        res.redirect('/user/home');
    });
});

export default router;