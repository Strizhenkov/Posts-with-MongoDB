import {Response} from 'express';
import {ErrorHandler} from './errorHandler.ts';
import {IValidationStep} from './validationSteps/iValidationStep.ts';

export class Validator {
    private steps: IValidationStep[] = [];
    private errorHandler = new ErrorHandler();

    constructor(private res: Response, private route: string) {}

    public addStep(step: IValidationStep): this {
        this.steps.push(step);
        return this;
    }

    public async run(): Promise<boolean> {
        for (let i = 0; i < this.steps.length; i++) {
            if (!(await this.steps[i].execute(this.res, this.route, this.errorHandler))) {
                return false;
            }
        }
        return true;
    }

    public async safeExecute<T>(action: () => Promise<T>): Promise<T | void> {
        try {
            return await action();
        } catch (err: any) {
            this.errorHandler.handle(this.res, 500, this.route, err.message);
        }
    }
}