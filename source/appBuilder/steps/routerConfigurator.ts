import authRoutes from '../../routes/auth.ts';
import adminRoutes from '../../routes/roles/admin.ts';
import authorRoutes from '../../routes/roles/author.ts';
import userRoutes from '../../routes/roles/user.ts';
import type {IServerStep} from './iServerStep.ts';
import type {Express} from 'express';

export class RouterConfigurator implements IServerStep  {
    public execute(app: Express, stepIndex: number): void {
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