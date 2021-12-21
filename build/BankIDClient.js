"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIDClient = void 0;
var axios_1 = __importDefault(require("axios"));
var crypto_1 = __importDefault(require("crypto"));
var https_1 = __importDefault(require("https"));
var BankIDError_1 = require("./BankIDError");
var BankIDClient = /** @class */ (function () {
    function BankIDClient(options) {
        this.options = options;
        this.agent = new https_1.default.Agent({
            pfx: this.options.pfx,
            passphrase: this.options.passphrase,
            ca: this.options.ca
        });
        this.client = axios_1.default.create({
            baseURL: this.options.production
                ? BankIDClient.API_URLS.PRODUCTION
                : BankIDClient.API_URLS.DEVELOPMENT,
            httpsAgent: this.agent,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    BankIDClient.prototype.generateStaticQrInput = function (_a) {
        var autoStartToken = _a.autoStartToken;
        return "bankid:///?autostarttoken=".concat(autoStartToken);
    };
    BankIDClient.prototype.generateAnimatedQrInput = function (_a, timestamp) {
        var qrStartToken = _a.qrStartToken, qrStartSecret = _a.qrStartSecret;
        var time = Math.floor((new Date().getTime() - timestamp) / 1000);
        var qrAuthCode = crypto_1.default.createHmac('sha256', qrStartSecret).update(time.toString()).digest('hex');
        return ['bankid', qrStartToken, time, qrAuthCode].join('.');
    };
    BankIDClient.prototype.authenticate = function (parameters) {
        return this._call('/auth', parameters);
    };
    BankIDClient.prototype.authenticateAndCollect = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticate(parameters)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this._awaitPendingCollect(response.orderRef)];
                }
            });
        });
    };
    BankIDClient.prototype.sign = function (parameters) {
        parameters.userVisibleData = Buffer.from(parameters.userVisibleData).toString('base64');
        if (parameters.userNonVisibleData) {
            parameters.userNonVisibleData = Buffer.from(parameters.userNonVisibleData).toString('base64');
        }
        return this._call('/sign', parameters);
    };
    BankIDClient.prototype.signAndCollect = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sign(parameters)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this._awaitPendingCollect(response.orderRef)];
                }
            });
        });
    };
    BankIDClient.prototype.cancel = function (parameters) {
        return this._call('/cancel', parameters);
    };
    BankIDClient.prototype.collect = function (parameters) {
        return this._call('/collect', parameters);
    };
    BankIDClient.prototype._awaitPendingCollect = function (orderRef) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var call = function () {
                _this.collect({
                    orderRef: orderRef
                })
                    .then(function (response) {
                    if (response.status === 'complete'
                        || response.status === 'failed') {
                        return resolve(response);
                    }
                    setTimeout(call, _this.options.collectInterval || 2000);
                })
                    .catch(function (e) { return reject(e); });
            };
            call();
        });
    };
    BankIDClient.prototype._call = function (endpoint, parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.post(endpoint, parameters)
                .then(function (_a) {
                var data = _a.data;
                return resolve(data);
            })
                .catch(function (e) {
                if (e.response) {
                    return reject(new BankIDError_1.BankIDError(e.response.data.errorCode, e.response.data.details));
                }
                reject(e);
            });
        });
    };
    BankIDClient.API_URLS = {
        DEVELOPMENT: 'https://appapi2.test.bankid.com/rp/v5.1',
        PRODUCTION: 'https://appapi2.bankid.com/rp/v5.1'
    };
    return BankIDClient;
}());
exports.BankIDClient = BankIDClient;
