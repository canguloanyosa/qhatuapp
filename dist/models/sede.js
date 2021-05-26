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
const mongoose_1 = require("mongoose");
const SedeSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { collection: 'sedes' });
SedeSchema.method('toJSON', function () {
    const _a = this.toObject(), { __v } = _a, Object = __rest(_a, ["__v"]);
    return Object;
});
exports.Sede = mongoose_1.model('Sede', SedeSchema);
