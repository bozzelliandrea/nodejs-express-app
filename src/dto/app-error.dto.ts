import {HttpCode} from "../utils/http-code.enum";

export class AppErrorDto extends Error {
    public readonly code: HttpCode;

    constructor(message: string, code?: HttpCode, name?: string) {
        super();
        this.message = message;
        this.code = code || HttpCode.INTERNAL_SERVER_ERROR;
        this.name = name || (code ? HttpCode[code] : HttpCode[HttpCode.INTERNAL_SERVER_ERROR]);
    }

}