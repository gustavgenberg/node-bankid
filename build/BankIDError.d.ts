import { BankIDErrorCode } from './types';
export declare class BankIDError extends Error {
    readonly code: BankIDErrorCode;
    readonly details?: string | undefined;
    constructor(code: BankIDErrorCode, details?: string | undefined);
}
