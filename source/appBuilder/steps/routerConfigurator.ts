import {Express} from 'express';
import authRoutes from '../../routes/auth.ts';
import userRoutes from '../../routes/roles/user.ts';
import authorRoutes from '../../routes/roles/author.ts';
import adminRoutes from '../../routes/roles/admin.ts';
import {IServerStep} from './iServerStep.ts';

export class RouterConfigurator implements IServerStep  {
    execute(app: Express, stepIndex: number): void {
        try {
            app.get('/', (req, res) => res.redirect('/auth/register'));
            app.use('/auth', authRoutes);
            app.use('/user', userRoutes);
            app.use('/author', authorRoutes);
            app.use('/admin', adminRoutes);
            console.log(`${stepIndex + 1}) Routers registered successfully.`);
        } catch (err) {
            console.error(`${stepIndex + 1}) Router configuration failed:`, err);
            throw err;
        }
    }
}