"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socio = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const socioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
    },
    dni: {
        type: String,
        required: [true, 'El documento de identidad es necesario'],
        unique: true
    },
    password: {
        type: String,
    },
    password_show: {
        type: String,
        item: null
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    celular: {
        type: String,
        item: null
    },
    ubicacion: {
        type: String,
        item: null
    },
    departamento: {
        type: String,
        item: null
    },
    provincia: {
        type: String,
        item: null
    },
    region: {
        type: String,
        item: null
    },
    avatar: {
        type: String,
        default: 'av-10.png'
    },
    push: {
        type: String,
        item: null
    }
});
socioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Socio = mongoose_1.model('Socio', socioSchema);
