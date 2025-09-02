import type {Logger} from '../../utiles/logger';
import type {Express} from 'express';

export interface IServerStep {
    execute(app: Express, stepIndex: number, stepLogger: Logger): Promise<void> | void;
}