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
const propiedades_model_1 = require("../models/propiedades.model");
const propiedadesRoutes = express_1.Router();
propiedadesRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    // console.log(desde);
    const [propiedades, total] = yield Promise.all([
        propiedades_model_1.Propiedades.find()
            .sort({ _id: -1 })
            .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(30),
        propiedades_model_1.Propiedades.countDocuments()
    ]);
    res.json({
        ok: true,
        total,
        propiedades,
        id: req.id
    });
}));
// Crear una  solicitud en la seccion SERVICIOS
propiedadesRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    propiedades_model_1.Propiedades.create(body).then((propiedadesDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield propiedadesDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            propiedades: propiedadesDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = propiedadesRoutes;
//Actualizar Propiedades
propiedadesRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const propiedades = {
        codigo: req.body.codigo,
        altitud: req.body.altitud,
        precipitacion: req.body.precipitacion,
        temperatura: req.body.temperatura,
        hectareas: req.body.hectareas,
    };
    propiedades_model_1.Propiedades.findByIdAndUpdate(id, propiedades, { new: true }, (err, propiedades) => {
        if (err)
            throw err;
        if (!propiedades) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            propiedades
        });
    });
});
//Borrar Servicio Recojo de cacao
propiedadesRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    propiedades_model_1.Propiedades.findByIdAndRemove(id, (err, propiedades) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Propiedad Eliminada',
            body: propiedades
        });
    });
});
