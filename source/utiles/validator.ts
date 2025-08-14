import {Response} from 'express';
import {ErrorHandler} from './errorHandler.ts';
import {IValidationStep} from './validationSteps/iValidationStep.ts';

export class Validator {
    private _steps: IValidationStep[] = [];
    private _errorHandler = new ErrorHandler();

    public constructor(private res: Response, private route: string) {}

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