import type {Response} from 'express';

export class ErrorHandler {
    private readonly errorMessages: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        408: 'Request Timeout',
        500: 'Internal Server Error'
    };

    public handle(res: Response, statusCode: number, context: string, details: string) {
        const short = this.errorMessages[statusCode] || 'Unknown Error';
        console.error(`[Error ${statusCode} - ${short}] in ${context}: ${details}`);

        res.status(statusCode).json({
            error: short,
            details
        });
    }
}