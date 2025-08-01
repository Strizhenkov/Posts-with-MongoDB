import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import {ErrorHandler} from "../../utiles/errorHandler.ts";

const router = Router();

router.get('/deleteUser', (req: Request, res: Response) => {
    res.render('deleteUser');
});

router.post('/deleteUser', async (req: Request, res: Response) => {
    const {userId} = req.body;
    try {
        const admin = await User.findById(req.session.userId);
        if (!admin || admin.role !== 'admin') return ErrorHandler.handle(res, 403, "DELETE /login", "Admin command only");

        await User.findByIdAndDelete(userId);
        res.redirect('/user/home');
    } catch (err: any) {
        ErrorHandler.handle(res, 400, "DELETE /login", err.message);
    }
});

export default router;
