import {Express} from 'express';

export interface IServerStep {
    execute(app: Express, stepIndex: number): Promise<void> | void;
}