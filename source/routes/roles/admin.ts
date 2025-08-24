import {Router} from 'express';
import {UserDBUnit} from '../../model/dbUnits/userUnit.ts';
import {AdminType} from '../../model/helpers/roles.ts';
import {SafeRunner} from '../../utiles/safeRunner.ts';
import {AuthenticatedCheck, UserRoleValidCheck, UserExistsByIdCheck} from '../../utiles/validationSteps/validationConfig.ts';
import {Validator} from '../../utiles/validator.ts';
import type {Request, Response} from 'express';

const router = Router();

router.get('/deleteUser', (req: Request, res: Response) => {
    res.render('deleteUser');
});

router.post('/deleteUser', async (req: Request, res: Response) => {
    const routerURL = 'DELETE /admin/deleteUser';
    const {userId} = req.body;
    const adminId = req.session.userId;

    const validator = new Validator(res, routerURL)
        .addStep(new AuthenticatedCheck(adminId))
        .addStep(new UserExistsByIdCheck(adminId))
        .addStep(new UserRoleValidCheck(adminId as string, new AdminType().getRole()))
        .addStep(new UserExistsByIdCheck(userId));

    if (!(await validator.run())) return;

    const safeRunner = new SafeRunner(res, routerURL);
    await safeRunner.safeExecute(async () => {
        await UserDBUnit.deleteById(userId);
    });
});

export default router;