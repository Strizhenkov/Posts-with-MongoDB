import {Router, Request, Response} from "express";
import {Validator} from "../../utiles/validator.ts";
import {AdminType} from "../../model/helpers/roles.ts";
import {AuthenticatedCheck} from "../../utiles/validationSteps/authenticatedCheck.ts";
import {UserRoleValidCheck} from "../../utiles/validationSteps/userRoleValidCheck.ts";
import {UserExistsByIdCheck} from "../../utiles/validationSteps/userExistsByIdCheck.ts";
import {UserDBUnit} from "../../model/dbUnits/userUnit.ts";

const router = Router();

router.get('/deleteUser', (req: Request, res: Response) => {
    res.render('deleteUser');
});

router.post('/deleteUser', async (req: Request, res: Response) => {
    const routerURL = "DELETE /admin/deleteUser";
    const {userId} = req.body;
    const adminId = req.session.userId;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(adminId))
        .addStep(new UserRoleValidCheck(adminId, new AdminType().getRole()))
        .addStep(new UserExistsByIdCheck(userId));

    if (!(await validator.run())) return;

    await validator.safeExecute(async () => {
        await UserDBUnit.deleteById(userId);
        res.redirect('/user/home');
    });
});

export default router;
