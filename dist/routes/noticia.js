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
//Obetner Usuarios x2
noticiaRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    const [noticias, total] = yield Promise.all([
        noticia_model_1.Noticia.find()
            .sort({ _id: -1 })
            // .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(5),
        noticia_model_1.Noticia.countDocuments()
    ]);
    res.json({
        ok: true,
        noticias,
        total,
        id: req.id
    });
}));
//Crear POST
noticiaRoutes.post('/', (req, res) => {
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
        portada: req.body.portada,
        color: req.body.color,
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
//Actualizar Servicio Recojo de Cacao
noticiaRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const noticia = {
        titulo: req.body.titulo,
        portada: req.body.portada,
        descripcion: req.body.descripcion,
        color: req.body.color,
        url: req.body.url,
    };
    noticia_model_1.Noticia.findByIdAndUpdate(id, noticia, { new: true }, (err, noticia) => {
        if (err)
            throw err;
        if (!noticia) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
        });
        noticia;
    });
});
// Borrar Noticia 
noticiaRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    noticia_model_1.Noticia.findByIdAndRemove(id, (err, noticia) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Noticia Eliminada',
            body: noticia
        });
    });
});
exports.default = noticiaRoutes;
