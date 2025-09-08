import createAuthRoutes from '../../routes/auth.ts';
import createAdminRoutes from '../../routes/roles/admin.ts';
import createAuthorRoutes from '../../routes/roles/author.ts';
import createUserRoutes from '../../routes/roles/user.ts';
import type {IServerStep} from './iServerStep.ts';
import type {IHtmlComparator} from '../../comporator/iHtmlComparator.ts';
import type {Logger} from '../../utiles/logger.ts';
import type {Express} from 'express';

export class RouterConfigurator implements IServerStep  {
    constructor(private _useLogger: Logger, private _comporatorAdapter: IHtmlComparator) {}

    public execute(app: Express, stepIndex: number, stepLogger: Logger): void {
        try {
            app.get('/', (req, res) => res.redirect('/auth/register'));
            app.use('/auth', createAuthRoutes(this._useLogger));
            app.use('/user', createUserRoutes(this._useLogger));
            app.use('/author', createAuthorRoutes(this._useLogger, this._comporatorAdapter));
            app.use('/admin', createAdminRoutes(this._useLogger));
            stepLogger.log(`${stepIndex + 1}) Routers registered successfully.`);
        } catch (err) {
            stepLogger.error(`${stepIndex + 1}) Router configuration failed:`, err);
            throw err;
        }
    }
}