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
const autenticationSocio_1 = require("../middlewares/autenticationSocio");
const webpush = require('web-push');
const compraRoutes = express_1.Router();
//Obtener compra Paginados
compraRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const compras = yield compra_model_1.Compra.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('socio')
        .exec();
    res.json({
        ok: true,
        pagina,
        compras
    });
}));
//Obtener Compras Paginados
compraRoutes.get('/listar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const compras = yield compra_model_1.Compra.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(80)
        .populate('socio')
        .exec();
    res.json({
        ok: true,
        pagina,
        compras
    });
}));
//Obetner 10 precios
compraRoutes.get('/10', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    const [compras, total] = yield Promise.all([
        compra_model_1.Compra.find({})
            .sort({ _id: -1 })
            .skip(desde)
            .limit(80),
        compra_model_1.Compra.countDocuments()
    ]);
    res.json({
        ok: true,
        compras,
        total,
        id: req.id
    });
}));
//Obetner Servicios x2
compraRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [compra, total] = yield Promise.all([
        compra_model_1.Compra.find()
            .sort({ _id: -1 })
            .populate('socio', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(5),
        compra_model_1.Compra.countDocuments()
    ]);
    res.json({
        ok: true,
        compra,
        total,
        id: req.id
    });
}));
// Crear una  solicitud en la seccion SERVICIOS
compraRoutes.post('/', [autenticationSocio_1.verificaTokenSocio], (req, res) => {
    const body = req.body;
    body.socio = req.socio._id;
    compra_model_1.Compra.create(body).then((compraDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield compraDB.populate('socio').execPopulate();
        res.json({
            ok: true,
            compras: compraDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// Actualizar Servicio Recojo de Cacao
compraRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const compra = {
        estado: req.body.estado,
        calificacion: req.body.calificacion,
    };
    compra_model_1.Compra.findByIdAndUpdate(id, compra, { new: true }, (err, compra) => {
        if (err)
            throw err;
        if (!compra) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
        });
        compra;
    });
});
// Borrar Servicio Recojo de cacao
compraRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    compra_model_1.Compra.findByIdAndRemove(id, (err, compras) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Compra Eliminada',
            body: compras
        });
    });
});
// Actualizar compras
compraRoutes.post('/updatecompra/:id', (req, res) => {
    const id = req.params.id;
    const compra = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        email: req.body.email,
        celular: req.body.celular,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        total: req.body.total,
        farmerid: req.body.farmerid,
        estado: req.body.estado
    };
    compra_model_1.Compra.findByIdAndUpdate(id, compra, { new: true }, (err, compra) => {
        if (err)
            throw err;
        if (!compra) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
        });
        compra;
    });
});
//Obetner Usuarios TODOS
compraRoutes.get('/exportar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [compra, total] = yield Promise.all([
        compra_model_1.Compra.find({}, ' -_id  dni nombre celular precio cantidad total sede created')
            .sort({ _id: -1 })
    ]);
    res.json({
        ok: true,
        compra,
    });
}));
exports.default = compraRoutes;
