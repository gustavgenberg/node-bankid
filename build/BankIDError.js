"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIDError = void 0;
var BankIDError = /** @class */ (function (_super) {
    __extends(BankIDError, _super);
    function BankIDError(code, details) {
        var _this = _super.call(this, code) || this;
        _this.code = code;
        _this.details = details;
        Error.captureStackTrace(_this, _this.constructor);
        _this.name = 'BankIdError';
        return _this;
    }
    return BankIDError;
}(Error));
exports.BankIDError = BankIDError;
