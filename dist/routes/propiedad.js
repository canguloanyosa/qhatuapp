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
const propiedad_model_1 = require("../models/propiedad.model");
const propiedadRoutes = express_1.Router();
propiedadRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const propiedades = yield propiedad_model_1.Propiedad.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        propiedades
    });
}));
// Crear una  solicitud en la seccion SERVICIOS
propiedadRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    propiedad_model_1.Propiedad.create(body).then((propiedadDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield propiedadDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            propiedades: propiedadDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = propiedadRoutes;
