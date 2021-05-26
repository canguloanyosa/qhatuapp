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
const autenticacion_1 = require("../middlewares/autenticacion");
const express_1 = require("express");
const precios_model_1 = require("../models/precios.model");
const precioRoutes = express_1.Router();
// obtener el ultimo precio
precioRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;
    const precios = yield precios_model_1.Precio.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(1)
        .exec();
    res.json({
        ok: true,
        pagina,
        precios
    });
}));
// obtener el ultimo precio
precioRoutes.get('/historial', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;
    const precios = yield precios_model_1.Precio.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        precios
    });
}));
//crear precios 
precioRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    precios_model_1.Precio.create(body).then(PrecioDB => {
        res.json({
            ok: true,
            precio: PrecioDB
        });
    }).catch(err => {
        res.json(err);
    });
});
// Crear un sipo de solicitud en la seccion SERVICIOS
precioRoutes.post('/create', (req, res) => {
    const precio = {
        humedo1: req.body.humedo1,
        seco1: req.body.seco1,
        humedo2: req.body.humedo2,
        seco2: req.body.seco2,
        humedo3: req.body.humedo3,
        seco3: req.body.seco3,
        comentario: req.body.comentario,
    };
    precios_model_1.Precio.create(precio).then(PrecioDB => {
        res.json({
            ok: true,
            precio: PrecioDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = precioRoutes;
