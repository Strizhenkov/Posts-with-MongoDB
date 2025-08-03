import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import Post from "../../model/entities/post.ts";
import {Validator} from "../../utiles/validator.ts";

const router = Router();

router.get('/createPost', (req: Request, res: Response) => {
    res.render('createPost');
});

router.post('/createPost', async (req: Request, res: Response) => {
    const routerURL = "POST /author/createPost";
    const {title, content} = req.body;
    const userId = req.session.userId;
    
    if (!(await Validator.authenticatedCheck(res, userId, routerURL))) return;
    if (!(await Validator.userRoleValidCheck(res, userId, 'author', routerURL))) return;

    const user = await User.findById(userId);
    const newPost = new Post({title, content, author: user!._id, likes: []});

    await Validator.safe(res, routerURL, async () => {
        await newPost.save();
        res.redirect('/user/home');
    });
});

export default router;