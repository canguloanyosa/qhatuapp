"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const precioSchema = new mongoose_1.Schema({
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
    }
});
precioSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Precio = mongoose_1.model('Precio', precioSchema);
