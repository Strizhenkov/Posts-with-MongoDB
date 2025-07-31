import {Router, Request, Response} from "express";
import User from "../../model/entities/user.ts";

const router = Router();

router.get('/deleteUser', (req: Request, res: Response) => {
    res.render('deleteUser');
});

router.post('/deleteUser', async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const admin = await User.findById(req.session.userId);
        if (!admin || admin.role !== 'admin') return res.status(403).send("Access denied");

        await User.findByIdAndDelete(userId);
        res.redirect('/user/home');
    } catch (err: any) {
        res.status(400).send(err.message);
    }
});

export default router;
