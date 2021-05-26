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
const servicio2_model_1 = require("../models/servicio2.model");
const servicio2Routes = express_1.Router();
//Obtener Servicios Paginados
servicio2Routes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const servicios2 = yield servicio2_model_1.Servicio2.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        servicios2
    });
}));
//Obetner Servicios x2
servicio2Routes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    // console.log(desde);
    const [servicios2, total] = yield Promise.all([
        servicio2_model_1.Servicio2.find()
            .sort({ _id: -1 })
            .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(5),
        servicio2_model_1.Servicio2.countDocuments()
    ]);
    res.json({
        ok: true,
        servicios2,
        total,
        id: req.id
    });
}));
// Crear una  solicitud en la seccion SERVICIOS
servicio2Routes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    servicio2_model_1.Servicio2.create(body).then((servicio2DB) => __awaiter(void 0, void 0, void 0, function* () {
        yield servicio2DB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            servicio2: servicio2DB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Actualizar Servicio Asistencia Tecnica
servicio2Routes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const servicio2 = {
        estado: req.body.estado,
        proceso: req.body.proceso,
        completado: req.body.completado,
        observacion: req.body.observacion,
        start: req.body.start,
    };
    servicio2_model_1.Servicio2.findByIdAndUpdate(id, servicio2, { new: true }, (err, servicio2) => {
        if (err)
            throw err;
        if (!servicio2) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            servicio2
        });
    });
});
//Borrar Servicio Recojo de cacao
servicio2Routes.delete('/:id', (req, res) => {
    const id = req.params.id;
    servicio2_model_1.Servicio2.findByIdAndRemove(id, (err, servicio2) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Servicio Asistencia Tecnica Eliminado',
            body: servicio2
        });
    });
});
exports.default = servicio2Routes;
