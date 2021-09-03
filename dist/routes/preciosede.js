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
const preciosede_model_1 = require("../models/preciosede.model");
const preciosedeRoutes = express_1.Router();
// Crear precio x sede
preciosedeRoutes.post('/create', (req, res) => {
    const preciosede = {
        humedo1: req.body.humedo1,
        seco1: req.body.seco1,
        humedo2: req.body.humedo2,
        sede: req.body.sede,
        seco2: req.body.seco2,
        humedo3: req.body.humedo3,
        seco3: req.body.seco3,
        comentario: req.body.comentario,
        img: req.body.img
    };
    preciosede_model_1.PrecioSede.create(preciosede).then(PrecioSedeDB => {
        res.json({
            ok: true,
            preciosede: PrecioSedeDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Obetner 30 precios por sede
preciosedeRoutes.get('/30', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [preciosede, total] = yield Promise.all([
        preciosede_model_1.PrecioSede.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
            .sort({ _id: -1 })
            .skip(desde)
            .limit(30),
        preciosede_model_1.PrecioSede.countDocuments()
    ]);
    res.json({
        ok: true,
        preciosede,
        total,
        id: req.id
    });
}));
//Obetner precios por sede x2
preciosedeRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [preciosede, total] = yield Promise.all([
        preciosede_model_1.PrecioSede.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        preciosede_model_1.PrecioSede.countDocuments()
    ]);
    res.json({
        ok: true,
        preciosede,
        total,
        id: req.id
    });
}));
//Borrar precio
preciosedeRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    preciosede_model_1.PrecioSede.findByIdAndRemove(id, (err, preciosede) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Precio Eliminado',
            body: preciosede
        });
    });
});
exports.default = preciosedeRoutes;
