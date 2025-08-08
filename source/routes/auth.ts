import {Router, Request, Response} from "express";
import User, {IUser} from "../model/entities/user.ts";
import {Validator} from "../utiles/validator.ts";
import {USER_ROLE_VALUES, UserType} from "../model/helpers/roles.ts";
import {PasswordMatchCheck} from "../utiles/validationSteps/passwordMacthCheck.ts";
import {UserExistsByNameCheck} from "../utiles/validationSteps/userExistsByNameCheck.ts";
import {UserDBUnit} from "../model/dbUnits/userUnit.ts";

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
    
    const validator = new Validator(res, routerURL);

    await validator.safeExecute(async () => {
        await UserDBUnit.create(user);
        req.session.userId = user.id;
        res.redirect('/user/home');
    });
});

router.post('/login', async (req: Request, res: Response) => {
    const routerURL = "POST /auth/login";
    const {username, password} = req.body;

    const validator = new Validator(res, routerURL)
        .addStep(new UserExistsByNameCheck(username))
        .addStep(new PasswordMatchCheck(username, password));

    if (!(await validator.run())) return;

    const user = await UserDBUnit.findByUsername(username) as IUser;

    req.session.userId = user.id;
    res.redirect('/user/home');
});

export default router;