"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const servicioSchema = new mongoose_1.Schema({
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
    asunto: {
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
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});
exports.Servicio = mongoose_1.model('Servicio', servicioSchema);
