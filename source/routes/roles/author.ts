import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import Post from "../../model/entities/post.ts";
import {ErrorHandler} from "../../utiles/errorHandler.ts";

const router = Router();

router.get('/createPost', (req: Request, res: Response) => {
    res.render('createPost');
});

router.post('/createPost', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== 'author') return ErrorHandler.handle(res, 403, "POST /createPost", "Author command only");

        const { title, content } = req.body;
        const newPost = new Post({
            title,
            content,
            author: user._id,
            likes: []
        });
        await newPost.save();
        res.redirect('/user/home');
    } catch (err: any) {
        ErrorHandler.handle(res, 400, "POST /createPost", err.message);
    }
});

export default router;