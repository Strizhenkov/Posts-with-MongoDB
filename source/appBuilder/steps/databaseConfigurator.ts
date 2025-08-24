import mongoose from 'mongoose';
import type {IServerStep} from './iServerStep.ts';
import type {Express} from 'express';

export class DatabaseConfigurator implements IServerStep {
    public async execute(_: Express, stepIndex: number): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URI as string);
            console.log(`${stepIndex + 1}) Database connected successfully.`);
        } catch (err) {
            console.error(`${stepIndex + 1}) Database connection failed:`, err);
            throw err;
        }
    }
}