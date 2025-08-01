import {Router, Request, Response} from "express";
import User from "../model/entities/user.ts";
import {ErrorHandler} from "../utiles/errorHandler.ts";

const router = Router();

router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});

router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const {username, password, role} = req.body;
        const user = new User({username, password, role: ['user', 'author', 'admin'].includes(role) ? role : 'user'});

        await user.save();
        req.session.userId = user.id;
        res.redirect('/user/home');
    } catch (err: any) {
        ErrorHandler.handle(res, 400, "POST /register", err.message);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user || !(await user.comparePassword(password))) {
        return ErrorHandler.handle(res, 400, "POST /login", "Wrong username or password");
    }

    req.session.userId = user.id;
    res.redirect('/user/home');
});

export default router;