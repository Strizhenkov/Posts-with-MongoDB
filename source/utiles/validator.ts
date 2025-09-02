import {ErrorHandler} from './errorHandler.ts';
import type {Logger} from './logger.ts';
import type {IValidationStep} from './validationSteps/iValidationStep.ts';
import type {Response} from 'express';

export class Validator {
    private _steps: IValidationStep[] = [];
    private _errorHandler = new ErrorHandler(this.logger);

    constructor(private res: Response, private route: string, private logger : Logger) {}

    public addStep(step: IValidationStep): Validator {
        this._steps.push(step);
        return this;
    }

    public async run(): Promise<boolean> {
        for (let i = 0; i < this._steps.length; i++) {
            if (!(await this._steps[i].execute(this.res, this.route, this._errorHandler))) {
                return false;
            }
        }
        return true;
    }
}