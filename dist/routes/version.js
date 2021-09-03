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
const version_model_1 = require("../models/version.model");
const versionRoutes = express_1.Router();
//crear version 
versionRoutes.post('/', (req, res) => {
    const body = req.body;
    version_model_1.Version.create(body).then(VersionDB => {
        res.json({
            ok: true,
            precio: VersionDB
        });
    }).catch(err => {
        res.json(err);
    });
});
//Obetner version
versionRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;
    const version = yield version_model_1.Version.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(1)
        .exec();
    res.json({
        ok: true,
        pagina,
        version
    });
}));
//Obetner Servicios x2
versionRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [version, total] = yield Promise.all([
        version_model_1.Version.find()
            .sort({ _id: -1 })
            // .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(5),
        version_model_1.Version.countDocuments()
    ]);
    res.json({
        ok: true,
        version,
        total,
        id: req.id
    });
}));
exports.default = versionRoutes;
