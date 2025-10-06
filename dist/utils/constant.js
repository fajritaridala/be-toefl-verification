"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = exports.PINATA = exports.ROLES = void 0;
// kontrol akses user
var ROLES;
(function (ROLES) {
    ROLES["PESERTA"] = "peserta";
    ROLES["ADMIN"] = "admin";
})(ROLES || (exports.ROLES = ROLES = {}));
var PINATA;
(function (PINATA) {
    PINATA["PRIVATE"] = "private";
    PINATA["PUBLIC"] = "public";
})(PINATA || (exports.PINATA = PINATA = {}));
var STATUS;
(function (STATUS) {
    STATUS["SELESAI"] = "selesai";
    STATUS["BELUM_SELESAI"] = "belum selesai";
})(STATUS || (exports.STATUS = STATUS = {}));
