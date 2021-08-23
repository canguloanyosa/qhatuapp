"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servicio = void 0;
const mongoose_1 = require("mongoose");
const servicioSchema = new mongoose_1.Schema({
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
    grano: {
        type: String
    },
    cantidad: {
        type: String
    },
    precio: {
        type: String
    },
    tecnico: {
        type: String
    },
    comentario: {
        type: String
    },
    estado: {
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
    start: {
        type: String,
        default: '0'
    },
    observacion: {
        type: String,
        default: ''
    },
    id_push: {
        type: String,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});
servicioSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Servicio = mongoose_1.model('Servicio', servicioSchema);
