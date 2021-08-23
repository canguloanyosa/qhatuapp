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
const compra_model_1 = require("../models/compra.model");
const socio_model_1 = require("../models/socio.model");
const { validarJWT } = require('../middlewares/validar-jwt');
const busquedaCompraRouter = express_1.Router();
busquedaCompraRouter.get('/coleccion/:tabla/:busquedacompra', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // const regex = new RegExp( busqueda, 'i');
    const regex = new RegExp(busqueda);
    let data = [];
    switch (tabla) {
        case 'compra':
            data = yield compra_model_1.Compra.find({ dni: regex })
                .populate('compra', 'nombre dni celular')
                .populate('socio', 'nombre dni email celular');
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
module.exports = busquedaCompraRouter;
