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
//Obetner Servicios x2
servicioRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [servicios, total] = yield Promise.all([
        servicio_model_1.Servicio.find()
            .sort({ _id: -1 })
            .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(5),
        servicio_model_1.Servicio.countDocuments()
    ]);
    res.json({
        ok: true,
        servicios,
        total,
        id: req.id
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
//Actualizar Servicio Recojo de Cacao
servicioRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const servicios = {
        estado: req.body.estado,
        proceso: req.body.proceso,
        completado: req.body.completado,
        observacion: req.body.observacion,
        grano: req.body.grano,
        sede: req.body.sede,
        tecnico: req.body.tecnico,
        comentario: req.body.comentario || req.servicios.comentario,
        precio: req.body.precio,
        start: req.body.start,
        cantidad: req.body.cantidad,
    };
    servicio_model_1.Servicio.findByIdAndUpdate(id, servicios, { new: true }, (err, servicios) => {
        if (err)
            throw err;
        if (!servicios) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
        });
        servicios;
    });
});
//Borrar Servicio Recojo de cacao
servicioRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    servicio_model_1.Servicio.findByIdAndRemove(id, (err, servicios) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Mensaje Eliminado',
            body: servicios
        });
    });
});
//Exportar
servicioRoutes.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [servicios] = yield Promise.all([
        servicio_model_1.Servicio.find()
            .sort({ _id: -1 })
    ]);
    res.json({
        ok: true,
        servicios,
    });
}));
exports.default = servicioRoutes;
