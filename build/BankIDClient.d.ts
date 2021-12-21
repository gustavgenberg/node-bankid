/// <reference types="node" />
import { AuthenticationParameters, AuthenticationResponse, CancelParameters, CancelResponse, CollectParameters, CollectResponse, SignParameters, SignResponse } from './types';
export declare class BankIDClient {
    private options;
    static API_URLS: {
        DEVELOPMENT: string;
        PRODUCTION: string;
    };
    private agent;
    private client;
    constructor(options: {
        pfx: Buffer;
        passphrase: string;
        ca: Buffer;
        production?: boolean;
        collectInterval?: number;
    });
    generateStaticQrInput({ autoStartToken }: AuthenticationResponse | SignResponse): string;
    generateAnimatedQrInput({ qrStartToken, qrStartSecret }: AuthenticationResponse | SignResponse, timestamp: number): string;
    authenticate(parameters: AuthenticationParameters): Promise<AuthenticationResponse>;
    authenticateAndCollect(parameters: AuthenticationParameters): Promise<CollectResponse>;
    sign(parameters: SignParameters): Promise<SignResponse>;
    signAndCollect(parameters: SignParameters): Promise<CollectResponse>;
    cancel(parameters: CancelParameters): Promise<CancelResponse>;
    collect(parameters: CollectParameters): Promise<CollectResponse>;
    private _awaitPendingCollect;
    private _call;
}
