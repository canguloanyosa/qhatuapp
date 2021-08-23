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
    const precios = yield precios_model_1.Precio.find({}, '-_id created humedo1 seco1 humedo2')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(5)
        .exec();
    res.json({
        precios
    });
}));
//Obetner precios x2
precioRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    const [precios, total] = yield Promise.all([
        precios_model_1.Precio.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
            .sort({ _id: -1 })
            // .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(5),
        precios_model_1.Precio.countDocuments()
    ]);
    res.json({
        ok: true,
        precios,
        total,
        id: req.id
    });
}));
//Obetner Usuarios x2  nuevo
precioRoutes.get('/30', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    const [precios, total] = yield Promise.all([
        precios_model_1.Precio.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
            .sort({ _id: -1 })
            // .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(30),
        precios_model_1.Precio.countDocuments()
    ]);
    res.json({
        ok: true,
        precios,
        total,
        id: req.id
    });
}));
//Obetner 10 precios
precioRoutes.get('/10', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    const [precios, total] = yield Promise.all([
        precios_model_1.Precio.find({}, '_id created comentario humedo1 seco1 humedo2 humedo3 seco3 sede')
            .sort({ _id: -1 })
            // .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(10),
        precios_model_1.Precio.countDocuments()
    ]);
    res.json({
        ok: true,
        precios,
        total,
        id: req.id
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
        sede: req.body.sede,
        seco2: req.body.seco2,
        humedo3: req.body.humedo3,
        seco3: req.body.seco3,
        comentario: req.body.comentario,
        img: req.body.img
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
//Borrar precio
precioRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    precios_model_1.Precio.findByIdAndRemove(id, (err, precios) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Precio Eliminado',
            body: precios
        });
    });
});
//Actualizar precio
precioRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const precio = {
        humedo1: req.body.humedo1,
        seco1: req.body.seco1,
        humedo3: req.body.humedo3,
        seco3: req.body.seco3,
        comentario: req.body.comentario,
        sede: req.body.sede
    };
    precios_model_1.Precio.findByIdAndUpdate(id, precio, { new: true }, (err, precio) => {
        if (err)
            throw err;
        if (!precio) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            precio
        });
    });
});
exports.default = precioRoutes;
