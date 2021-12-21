export interface AuthenticationParameters {
   endUserIp: string;
   personalNumber?: string;
   requirement?: any;
}

export interface AuthenticationResponse {
   orderRef: string;
   autoStartToken: string;
   qrStartToken: string;
   qrStartSecret: string;
}

export interface SignParameters extends AuthenticationParameters {
   userVisibleData: string;
   userNonVisibleData?: string;
   userVisibleDataFormat?: 'simpleMarkdownV1'
}

export interface SignResponse extends AuthenticationResponse { }

export interface CollectParameters {
   orderRef: string;
}

export interface CollectResponse {
   orderRef: string;
   status: 'pending' | 'failed' | 'complete';
   hintCode?: FailedHintCode | PendingHintCode;
   completionData?: CompletionData;
}

export interface CompletionData {
   user: {
      personalNumber: string;
      name: string;
      givenName: string;
      surname: string;
   }
   device: {
      ipAddress: string;
   }
   cert: {
      notBefore: string;
      notAfter: string;
   }
   signature: string;
   ocspResponse: string;
}

export type FailedHintCode =
   | 'expiredTransaction'
   | 'certificateErr'
   | 'userCancel'
   | 'cancelled'
   | 'startFailed'

export type PendingHintCode =
   | 'outstandingTransaction'
   | 'noClient'
   | 'started'
   | 'userSign'

export interface CancelParameters extends CollectParameters { }
export interface CancelResponse { }

export enum BankIDErrorCode {
   ALREADY_IN_PROGRESS = "alreadyInProgress",
   INVALID_PARAMETERS = "invalidParameters",
   UNAUTHORIZED = "unauthorized",
   NOT_FOUND = "notFound",
   METHOD_NOT_ALLOWED = "methodNotAllowed",
   REQUEST_TIMEOUT = "requestTimeout",
   UNSUPPORTED_MEDIA_TYPE = "unsupportedMediaType",
   INTERNAL_ERROR = "internalError",
   MAINTENANCE = "maintenance",
}