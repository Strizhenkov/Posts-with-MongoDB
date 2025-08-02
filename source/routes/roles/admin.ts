import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";
import {ErrorHandler} from "../../utiles/errorHandler.ts";

const router = Router();

router.get('/deleteUser', (req: Request, res: Response) => {
    res.render('deleteUser');
});

router.post('/deleteUser', async (req: Request, res: Response) => {
    const routerURL = "DELETE /admin/deleteUser";
    const {userId} = req.body;
    const admin = await User.findById(req.session.userId);

    if (!admin) 
        return ErrorHandler.handle(res, 404, routerURL, "Admin not found");
    if (admin.role !== 'admin') 
        return ErrorHandler.handle(res, 403, routerURL, "Invalid role");

    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/user/home');
    } catch (err: any) {
        ErrorHandler.handle(res, 500, routerURL, err.message);
    }
});

export default router;
