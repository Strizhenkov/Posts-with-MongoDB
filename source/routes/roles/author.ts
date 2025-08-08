import {Router, Request, Response} from "express";
import Post from "../../model/entities/post.ts";
import {Validator} from "../../utiles/validator.ts";
import {AuthorType} from "../../model/helpers/roles.ts";
import {AuthenticatedCheck} from "../../utiles/validationSteps/authenticatedCheck.ts";
import {UserRoleValidCheck} from "../../utiles/validationSteps/userRoleValidCheck.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";
import {PostDBUnit} from "../../model/dbUnits/postUnit.ts";

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

    await validator.safeExecute(async () => {
        await PostDBUnit.create(newPost);
        res.redirect('/user/home');
    });
});

export default router;