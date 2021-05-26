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
const noticia_model_1 = require("../models/noticia.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const noticiaRoutes = express_1.Router();
noticiaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const noticias = yield noticia_model_1.Noticia.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        noticias
    });
}));
//Crear POST
noticiaRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    noticia_model_1.Noticia.create(body).then((noticiaDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield noticiaDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            noticia: noticiaDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Crear un sipo de solicitud en la seccion NOTICIAS
noticiaRoutes.post('/create', (req, res) => {
    const noticia = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        url: req.body.url,
    };
    noticia_model_1.Noticia.create(noticia).then(noticiaDB => {
        res.json({
            ok: true,
            servicio: noticiaDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
exports.default = noticiaRoutes;
