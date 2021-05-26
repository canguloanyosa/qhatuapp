"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const propiedadesSchema = new mongoose_1.Schema({
    codigo: {
        type: String
    },
    altitud: {
        type: String
    },
    precipitacion: {
        type: String
    },
    temperatura: {
        type: String
    },
    hectareas: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});
exports.Propiedades = mongoose_1.model('Propiedades', propiedadesSchema);
