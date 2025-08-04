import mongoose from 'mongoose';
import {IServerStep} from './iServerStep.ts';
import {Express} from 'express';

export class DatabaseConfigurator implements IServerStep {
    async execute(_: Express, stepIndex: number): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URI as string);
            console.log(`${stepIndex + 1}) Database connected successfully.`);
        } catch (err) {
            console.error(`${stepIndex + 1}) Database connection failed:`, err);
            throw err;
        }
    }
}