"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servicio2 = void 0;
const mongoose_1 = require("mongoose");
const servicio2Schema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    tipo: {
        type: String
    },
    fecha: {
        type: String
    },
    sede: {
        type: String
    },
    actividad: [{
            type: String
        }],
    asunto: {
        type: String
    },
    comentario: {
        type: String
    },
    proceso: {
        type: String,
        default: ''
    },
    completado: {
        type: String,
        default: ''
    },
    observacion: {
        type: String,
        default: ''
    },
    start: {
        type: String,
        default: '0'
    },
    estado: {
        type: String
    },
    id_push: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});
servicio2Schema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Servicio2 = mongoose_1.model('Servicio2', servicio2Schema);
