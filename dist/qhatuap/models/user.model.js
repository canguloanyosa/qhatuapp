"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        // required: [true, 'El nombre es necesario'] 
    },
    dni: {
        type: String,
        required: [true, 'El documento de identidad es necesario']
    },
    password: {
        type: String,
        // required: [true, 'La contraseña es necesaria']
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
    google: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: false
    },
    idFb: {
        type: String,
        unique: true,
    },
    idGoogle: {
        type: String,
        unique: true
    },
    perfil: {
        type: String,
    }
});
userSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.User = mongoose_1.model('User', userSchema);
