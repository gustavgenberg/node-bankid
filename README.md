# node-bankid

An npm module for integration with BankID.

## Usage

```javascript
import {BankIDClient} from 'node-bankid';

const client = new BankIDClient({
   pfx: '<pfx>',
   passphrase: '<passphrase>',
   ca: '<ca>',
   production: false,
   collectInterval: 1000
})

client.authenticateAndCollect({
   personalNumber: 'YYYYMMDDNNNN',
   endUserIp: '::1'
})
   .then((data) => console.log(data.completionData))
   .catch(console.error)
```

## Methods

* `authenticate()`
* `authenticateAndCollect()`
* `sign()`
* `signAndCollect()`
* `collect()`
* `cancel()`