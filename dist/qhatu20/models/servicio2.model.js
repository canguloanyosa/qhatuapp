"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const servicio2Schema = new mongoose_1.Schema({
    tipo: {
        type: String
    },
    fecha: {
        type: String
    },
    sede: {
        type: String
    },
    actividad: {
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
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});
exports.Servicio2 = mongoose_1.model('Servicio2', servicio2Schema);
