import { BankIDErrorCode } from './types';

export class BankIDError extends Error {
   constructor(
      readonly code: BankIDErrorCode,
      readonly details?: string
   ) {
      super(code);

      Error.captureStackTrace(this, this.constructor);

      this.name = 'BankIdError';
   }
}