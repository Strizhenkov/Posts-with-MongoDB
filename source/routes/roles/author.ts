import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import Post from "../../model/entities/post.ts";

const router = Router();

router.get('/createPost', (req: Request, res: Response) => {
    res.render('createPost');
});

router.post('/createPost', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== 'author') return res.status(403).send("Access denied");

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
        res.status(400).send(err.message);
    }
});

export default router;