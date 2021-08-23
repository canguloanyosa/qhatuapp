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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { validarJWT } = require('../middlewares/validar-jwt');
const tecnico_model_1 = require("../models/tecnico.model");
const sede_model_1 = require("../models/sede.model");
const admin_model_1 = require("../models/admin.model");
const usuario_model_1 = require("../models/usuario.model");
const socio_model_1 = require("../models/socio.model");
const compra_model_1 = require("../models/compra.model");
const servicio_model_1 = require("../models/servicio.model");
const servicio2_model_1 = require("../models/servicio2.model");
const busquedaRouter = express_1.Router();
//Buscar Todo
busquedaRouter.get('/:busqueda', validarJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    const [admin, sede, tecnico] = yield Promise.all([
        admin_model_1.Admin.find({ nombre: regex }),
        sede_model_1.Sede.find({ nombre: regex }),
        tecnico_model_1.Tecnico.find({ nombre: regex })
    ]);
    res.json({
        ok: true,
        admin,
        sede,
        tecnico
    });
}));
//Buscar por coleccion
// busquedaRouter.get('/coleccion/:tabla/:busqueda', validarJWT, async (req: any, res: any) => {
busquedaRouter.get('/coleccion/:tabla/:busqueda', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // const regex = new RegExp( busqueda, 'i');
    const regex = new RegExp(busqueda);
    let data = [];
    switch (tabla) {
        case 'tecnico':
            data = yield tecnico_model_1.Tecnico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('sede', 'nombre img');
            break;
        case 'sede':
            data = yield sede_model_1.Sede.find({ nombre: regex })
                .populate('usuario', 'nombre img');
            break;
        case 'admin':
            data = yield admin_model_1.Admin.find({ nombre: regex })
                .populate('usuario', 'nombre img');
            break;
        case 'usuario':
            data = yield usuario_model_1.Usuario.find({ nombre: regex })
                .populate('usuario', 'nombre dni email celular');
            break;
        case 'dni':
            data = yield usuario_model_1.Usuario.find({ dni: regex })
                .populate('usuario', 'nombre dni email celular');
            break;
        case 'farmerid':
            data = yield usuario_model_1.Usuario.find({ farmerid: regex })
                .populate('usuario', 'nombre dni farmerid email celular');
            break;
        case 'email':
            data = yield usuario_model_1.Usuario.find({ email: regex })
                .populate('usuario', 'nombre dni email celular');
            break;
        case '_id':
            data = yield usuario_model_1.Usuario.find({ _id: regex })
                .populate('usuario', '_id nombre dni email celular');
            break;
        case 'compra':
            data = yield compra_model_1.Compra.find({ sede: regex })
                .populate('socio', 'nombre dni email celular');
            break;
        case 'servicio':
            data = yield servicio_model_1.Servicio.find({ sede: regex })
                .populate('usuario', 'avatar nombre dni email celular');
            break;
        case 'servicio2':
            data = yield servicio2_model_1.Servicio2.find({ sede: regex })
                .populate('usuario', 'nombre dni email celular');
            break;
        case 'socio':
            data = yield socio_model_1.Socio.find({ nombre: regex })
                .populate('socio', 'nombre dni email celular')
                .populate('compra', 'nombre dni celular');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La coleccion tiene que ser admin/sede/tecnico/usuario'
            });
    }
    res.json({
        ok: true,
        resultados: data
    });
}));
module.exports = busquedaRouter;
