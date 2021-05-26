"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
//login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ dni: body.dni }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                dni: userDB.dni,
                avatar: userDB.avatar,
                email: userDB.email,
                celular: userDB.celular,
                ubicacion: userDB.ubicacion,
                departamento: userDB.departamento,
                provincia: userDB.provincia,
                region: userDB.region,
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos ****'
            });
        }
    });
});
//crear usuario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        password_show: req.body.password_show,
        password: bcrypt_1.default.hashSync(req.body.password_show, 10),
        avatar: req.body.avatar,
        email: req.body.email,
        celular: req.body.celular,
        ubicacion: req.body.ubicacion,
        departamento: req.body.departamento,
        provincia: req.body.provincia,
        region: req.body.region,
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            dni: userDB.dni,
            avatar: userDB.avatar,
            email: userDB.email,
            celular: userDB.celular,
            ubicacion: userDB.ubicacion,
            departamento: userDB.departamento,
            provincia: userDB.provincia,
            region: userDB.region,
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        dni: req.body.dni || req.usuario.dni,
        avatar: req.body.avatar || req.usuario.avatar,
        email: req.body.email || req.usuario.email,
        celular: req.body.celular || req.usuario.celular,
        ubicacion: req.body.ubicacion || req.usuario.ubicacion,
        departamento: req.body.departamento || req.usuario.departamento,
        provincia: req.body.provincia || req.usuario.provincia,
        region: req.body.region || req.usuario.region,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            dni: userDB.dni,
            avatar: userDB.avatar,
            password: userDB.password,
            password_show: userDB.password_show,
            email: userDB.email,
            celular: userDB.celular,
            ubicacion: userDB.ubicacion,
            departamento: userDB.departamento,
            provincia: userDB.provincia,
            region: userDB.region,
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
