"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const token_1 = __importDefault(require("../classes/token"));
const user1Routes = express_1.Router();
const { generarJWT } = require('../helpers/jwt');
//Iniciar Sesion con Google
user1Routes.post('/login/google', (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        email: req.body.email,
        perfil: req.body.perfil,
        password: req.body.password,
        idGoogle: req.body.idGoogle,
    };
    try {
        const { nombre, email, dni, perfil, password, idGoogle } = yield user;
        const userDB = yield user_model_1.User.findOne({ idGoogle });
        let usuario;
        if (!userDB) {
            usuario = new user_model_1.User({
                nombre: nombre,
                dni: dni,
                email: email,
                perfil: perfil,
                password: '@@@',
                idGoogle: idGoogle,
                google: true,
            });
        }
        else {
            //existe usuario
            usuario = userDB;
            usuario.google = true;
        }
        // Guardar en Base de datos
        yield usuario.save();
        const token = yield token_1.default.getJwtToken(usuario.id);
        res.json({
            ok: true,
            msg: 'Google Login',
            user,
            token
        });
    }
    catch (_a) {
        res.status(401).json({
            ok: false,
            msg: 'Ups Error'
        });
    }
}));
exports.default = user1Routes;
