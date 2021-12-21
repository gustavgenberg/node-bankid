import axios, { AxiosError } from 'axios';
import crypto from 'crypto';
import https from 'https';
import { BankIDError } from './BankIDError';
import { AuthenticationParameters, AuthenticationResponse, CancelParameters, CancelResponse, CollectParameters, CollectResponse, SignParameters, SignResponse } from './types';

export class BankIDClient {

   public static API_URLS = {
      DEVELOPMENT: 'https://appapi2.test.bankid.com/rp/v5.1',
      PRODUCTION: 'https://appapi2.bankid.com/rp/v5.1'
   }

   private agent = new https.Agent({
      pfx: this.options.pfx,
      passphrase: this.options.passphrase,
      ca: this.options.ca
   })

   private client = axios.create({
      baseURL: this.options.production
         ? BankIDClient.API_URLS.PRODUCTION
         : BankIDClient.API_URLS.DEVELOPMENT,
      httpsAgent: this.agent,
      headers: {
         'Content-Type': 'application/json'
      }
   })

   constructor(
      private options: {
         pfx: Buffer;
         passphrase: string;
         ca: Buffer;
         production?: boolean;
         collectInterval?: number
      }
   ) { }

   public generateStaticQrInput({ autoStartToken }: AuthenticationResponse | SignResponse) {
      return `bankid:///?autostarttoken=${autoStartToken}`;
   }

   public generateAnimatedQrInput({ qrStartToken, qrStartSecret }: AuthenticationResponse | SignResponse, timestamp: number) {
      const time = Math.floor((new Date().getTime() - timestamp) / 1000);

      const qrAuthCode = crypto.createHmac('sha256', qrStartSecret).update(time.toString()).digest('hex');

      return ['bankid', qrStartToken, time, qrAuthCode].join('.');
   }

   public authenticate(parameters: AuthenticationParameters) {
      return this._call<AuthenticationParameters, AuthenticationResponse>('/auth', parameters);
   }

   public async authenticateAndCollect(parameters: AuthenticationParameters) {
      const response = await this.authenticate(parameters);
      return this._awaitPendingCollect(response.orderRef);
   }

   public sign(parameters: SignParameters) {
      parameters.userVisibleData = Buffer.from(parameters.userVisibleData).toString('base64');

      if (parameters.userNonVisibleData) {
         parameters.userNonVisibleData = Buffer.from(parameters.userNonVisibleData).toString('base64');
      }

      return this._call<SignParameters, SignResponse>('/sign', parameters);
   }

   public async signAndCollect(parameters: SignParameters) {
      const response = await this.sign(parameters);
      return this._awaitPendingCollect(response.orderRef);
   }

   public cancel(parameters: CancelParameters) {
      return this._call<CancelParameters, CancelResponse>('/cancel', parameters);
   }

   public collect(parameters: CollectParameters) {
      return this._call<CollectParameters, CollectResponse>('/collect', parameters);
   }

   private _awaitPendingCollect(orderRef: string) {
      return new Promise<CollectResponse>((resolve, reject) => {
         const call = () => {
            this.collect({
               orderRef
            })
               .then((response) => {
                  if (
                     response.status === 'complete'
                     || response.status === 'failed'
                  ) {
                     return resolve(response);
                  }

                  setTimeout(call, this.options.collectInterval || 2000);
               })
               .catch((e) => reject(e))
         }

         call();
      })
   }

   private _call<
      Parameters extends (
         AuthenticationParameters
         | SignParameters
         | CollectParameters
         | CancelParameters
      ),
      Response extends (
         AuthenticationResponse
         | SignResponse
         | CollectResponse
         | CancelResponse
      )
   >(endpoint: string, parameters: Parameters) {
      return new Promise<Response>((resolve, reject) => {
         this.client.post(endpoint, parameters)
            .then(({ data }) => resolve(data))
            .catch((e: AxiosError) => {
               if (e.response) {
                  return reject(
                     new BankIDError(
                        e.response.data.errorCode,
                        e.response.data.details,
                     )
                  )
               }

               reject(e);
            })
      })
   }

}