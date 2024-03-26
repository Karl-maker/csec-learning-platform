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