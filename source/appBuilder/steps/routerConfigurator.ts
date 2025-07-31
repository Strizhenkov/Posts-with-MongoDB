import {Express} from 'express';
import authRoutes from '../../routes/auth.ts';
import userRoutes from '../../routes/roles/user.ts';
import authorRoutes from '../../routes/roles/author.ts';
import adminRoutes from '../../routes/roles/admin.ts';

export class RouterConfigurator {
    configure(app: Express) {
        try {
            app.get('/', (req, res) => res.redirect('/auth/register'));
            app.use('/auth', authRoutes);
            app.use('/user', userRoutes);
            app.use('/author', authorRoutes);
            app.use('/admin', adminRoutes);
            console.log("4) Routers registered successfully.");
        } catch (err) {
            console.error("4) Router configuration failed:", err);
            throw err;
        }
    }
}