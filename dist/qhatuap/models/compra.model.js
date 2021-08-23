"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compra = void 0;
const mongoose_1 = require("mongoose");
var mongoose = require('mongoose'); // 1. require mongoose
var autoIncrement = require('mongoose-auto-increment');
const compraSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    dni: {
        type: String
    },
    id_cliente: {
        type: String
    },
    nombre: {
        type: String
    },
    farmerid: {
        type: String
    },
    avatar: {
        type: String
    },
    email: {
        type: String
    },
    celular: {
        type: String
    },
    precio: {
        type: String
    },
    precioold: {
        type: String
    },
    cantidad: {
        type: String
    },
    address: {
        type: String
    },
    tipo: {
        type: String
    },
    total: {
        type: String
    },
    foto: {
        type: String
    },
    firma: {
        type: String
    },
    sede: {
        type: String
    },
    calificacion: {
        type: String
    },
    estado: {
        type: String
    },
    push_cliente: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    socio: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Socio',
        required: [true, 'Debe existir una referencia a un socio']
    }
});
compraSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
//FF
autoIncrement.initialize(mongoose.connection); // 3. initialize autoIncrement 
compraSchema.plugin(autoIncrement.plugin, 'Compra');
exports.Compra = mongoose_1.model('Compra', compraSchema);
