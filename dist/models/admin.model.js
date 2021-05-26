"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
// const { Schema, model } = require('mongoose');
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    password_show: {
        type: String,
    },
    img: {
        type: String,
        default: 'https://admin.amazonastrading.com.pe/resources/images/icono-app.png'
    },
    role: {
        type: String,
        required: true,
        default: '0'
    },
    sedeATP: {
        type: String,
        required: true,
    },
    google: {
        type: Boolean,
        default: false
    },
});
AdminSchema.method('toJSON', function () {
    const _a = this.toObject(), { __v, _id, password } = _a, Object = __rest(_a, ["__v", "_id", "password"]);
    Object.id = _id;
    return Object;
});
exports.Admin = mongoose_1.model('Admin', AdminSchema);
