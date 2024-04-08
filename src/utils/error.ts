export class HTTPError extends Error {
    status: number;
    type: string;

    constructor(msg: string, status: number, type: string){
        super(msg);
        this.status = status;
        this.type = type;
    }
}

export class ForbiddenError extends HTTPError {
    constructor(message: string) {
        super(message, 403, 'Forbidden');
    }
}

export class UnauthorizedError extends HTTPError {
    constructor(message: string) {
        super(message, 401, 'Unauthorized');
    }
}

export class UnexpectedError extends HTTPError {
    constructor(message: string) {
        super(message, 500, 'Unexpected');
    }
}