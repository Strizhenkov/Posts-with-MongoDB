import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import {Validator} from "../../utiles/validator.ts";

const router = Router();

router.get('/deleteUser', (req: Request, res: Response) => {
    res.render('deleteUser');
});

router.post('/deleteUser', async (req: Request, res: Response) => {
    const routerURL = "DELETE /admin/deleteUser";
    const {userId} = req.body;
    const adminId = req.session.userId;

    if (!(await Validator.authenticatedCheck(res, adminId, routerURL))) return;
    if (!(await Validator.userRoleValidCheck(res, adminId, 'admin', routerURL))) return;
    if (!(await Validator.userExistsCheckById(res, userId, routerURL))) return;

    await Validator.safe(res, routerURL, async () => {
        await User.findByIdAndDelete(userId);
        res.redirect('/user/home');
    });
});

export default router;
