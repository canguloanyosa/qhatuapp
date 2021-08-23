"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recuperar = void 0;
const mongoose_1 = require("mongoose");
const recuperarSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    email: {
        type: String,
        required: [true, 'El documento de identidad es necesario']
    },
    nombre: {
        type: String,
    },
    dni: {
        type: String,
        required: [true, 'El documento de identidad es necesario']
    },
    userId: {
        type: String,
        item: null
    },
    mensaje: {
        type: String,
    },
    estado: {
        type: String,
        default: '0'
    }
});
recuperarSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Recuperar = mongoose_1.model('Recuperar', recuperarSchema);
