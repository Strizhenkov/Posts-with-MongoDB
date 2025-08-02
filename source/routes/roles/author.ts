import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import Post from "../../model/entities/post.ts";
import {ErrorHandler} from "../../utiles/errorHandler.ts";

const router = Router();

router.get('/createPost', (req: Request, res: Response) => {
    res.render('createPost');
});

router.post('/createPost', async (req: Request, res: Response) => {
    const routerURL = "POST /author/createPost";
    const {title, content} = req.body;
    const user = await User.findById(req.session.userId);

    if (!user)
        return ErrorHandler.handle(res, 404, routerURL, "Author not found");
    if (user.role !== 'author')
        return ErrorHandler.handle(res, 403, routerURL, "Author command only");

    const newPost = new Post({title, content, author: user._id, likes: []});

    try {
        await newPost.save();
        res.redirect('/user/home');
    } catch (err: any) {
        ErrorHandler.handle(res, 500, routerURL, err.message);
    }
});

export default router;