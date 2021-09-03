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
const express_validator_1 = require("express-validator");
const sedeRouter = express_1.Router();
const sede_model_1 = require("../models/sede.model");
const { validarJWT } = require('../middlewares/validar-jwt');
//Obetner Sedes
sedeRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sede = yield sede_model_1.Sede.find()
        .populate('admin', 'nombre img');
    res.json({
        ok: true,
        sede
    });
}));
//Obetner 
sedeRouter.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [sede, total] = yield Promise.all([
        sede_model_1.Sede.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        sede_model_1.Sede.countDocuments()
    ]);
    res.json({
        ok: true,
        sede,
        total,
        id: req.id
    });
}));
//Eliminar Sedes
sedeRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const sede = yield sede_model_1.Sede.findById(id);
        if (!sede) {
            return res.status(404).json({
                ok: true,
                msg: 'Sede no encontrada por identificador'
            });
        }
        yield sede_model_1.Sede.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Sede eliminado'
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
//Actualizar Sedes
sedeRouter.put('/:id', [
    validarJWT,
    express_validator_1.check('nombre', 'El nombre de la sede es obligatorio').not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const _id = req._id;
    try {
        const sede = yield sede_model_1.Sede.findById(id);
        if (!sede) {
            return res.status(404).json({
                ok: true,
                msg: 'Sede no encontrada por identificador'
            });
        }
        const cambioSede = Object.assign(Object.assign({}, req.body), { admin: _id });
        const sedeActualizado = yield sede_model_1.Sede.findByIdAndUpdate(id, cambioSede, { new: true });
        res.json({
            ok: true,
            msg: 'Actualizando sede',
            sede: sedeActualizado
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
//Crear Sedes
sedeRouter.post('/', [
    express_validator_1.check('nombre', 'El nombre de la sede es obligatorio').not().isEmpty(),
], (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const sede = new sede_model_1.Sede(Object.assign({ admin: id }, req.body));
    try {
        const sedeDB = yield sede.save();
        res.json({
            ok: true,
            sede: sedeDB
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
module.exports = sedeRouter;
