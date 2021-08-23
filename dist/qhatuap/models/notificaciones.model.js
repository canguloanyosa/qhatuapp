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
exports.Notificacion = void 0;
const mongoose_1 = require("mongoose");
const NotificacionSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        required: true,
        type: String
    },
    portada: {
        type: String,
        default: ''
    },
    userId: {
        type: String
    },
    pushId: {
        type: String
    },
    url: {
        type: String
    }
}, { collection: 'notificaciones' });
NotificacionSchema.method('toJSON', function () {
    const _a = this.toObject(), { __v } = _a, Object = __rest(_a, ["__v"]);
    return Object;
});
NotificacionSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Notificacion = mongoose_1.model('Notificacion', NotificacionSchema);
