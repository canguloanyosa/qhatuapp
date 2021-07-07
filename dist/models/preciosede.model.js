"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecioSede = void 0;
const mongoose_1 = require("mongoose");
const preciosedeSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    humedo1: {
        type: Number
    },
    seco1: {
        type: Number
    },
    humedo2: {
        type: Number
    },
    seco2: {
        type: Number
    },
    humedo3: {
        type: Number
    },
    seco3: {
        type: Number
    },
    comentario: {
        type: String
    },
    img: {
        type: String,
        default: ''
    },
    sede: {
        type: String,
    }
});
preciosedeSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.PrecioSede = mongoose_1.model('PricioSede', preciosedeSchema);
