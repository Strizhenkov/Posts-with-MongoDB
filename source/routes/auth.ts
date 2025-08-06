import {Router, Request, Response} from "express";
import User from "../model/entities/user.ts";
import {Validator} from "../utiles/validator.ts";
import {USER_ROLE_VALUES, UserType} from "../model/helpers/roles.ts";

const router = Router();

router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});

router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

router.post('/register', async (req: Request, res: Response) => {
    const routerURL = "POST /auth/register";
    const {username, password, role} = req.body;
    const user = new User({username, password, role: USER_ROLE_VALUES.includes(role) ? role : new UserType().getRole()});
    
    await Validator.safe(res, routerURL, async () => {
        await user.save();
        req.session.userId = user.id;
        res.redirect('/user/home');
    });
});

router.post('/login', async (req: Request, res: Response) => {
    const routerURL = "POST /auth/login";
    const {username, password} = req.body;

    if (!(await Validator.userExistsCheckByName(res, username, routerURL))) return;
    if (!(await Validator.passwordMatchCheck(res, username, password, routerURL))) return;

    const user = await User.findOne({username});

    req.session.userId = user!.id;
    res.redirect('/user/home');
});

export default router;