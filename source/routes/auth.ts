import {Router, Request, Response} from "express";
import User from "../model/entities/user.ts";

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
        res.status(400).send(`<h1>Register Error</h1><p>${err.message}</p>`);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).send(`<h1>Wrong data</h1>`);
    }

    req.session.userId = user.id;
    res.redirect('/user/home');
});

export default router;