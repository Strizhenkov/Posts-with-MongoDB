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
    const routerURL = "POST /register";
    const {username, password, role} = req.body;
    const user = new User({username, password, role: ['user', 'author', 'admin'].includes(role) ? role : 'user'});
    
    try {
        await user.save();
        req.session.userId = user.id;
        res.redirect('/user/home');
    } catch (err: any) {
        ErrorHandler.handle(res, 500, routerURL, err.message);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const routerURL = "POST /login";
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (!user) 
        return ErrorHandler.handle(res, 404, routerURL, "User not found");
    if (!(await user.comparePassword(password))) 
        return ErrorHandler.handle(res, 400, routerURL, "Wrong username or password");

    req.session.userId = user.id;
    res.redirect('/user/home');
});

export default router;