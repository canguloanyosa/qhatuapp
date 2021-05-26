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
const autenticacion_1 = require("../middlewares/autenticacion");
const servicio_model_1 = require("../models/servicio.model");
const servicioRoutes = express_1.Router();
//Obtener Servicios Paginados
servicioRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const servicios = yield servicio_model_1.Servicio.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        servicios
    });
}));
// Crear una  solicitud en la seccion SERVICIOS
servicioRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    servicio_model_1.Servicio.create(body).then((servicioDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield servicioDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            servicios: servicioDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = servicioRoutes;
