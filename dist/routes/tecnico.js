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
const tecnicoRouter = express_1.Router();
const tecnico_model_1 = require("../models/tecnico.model");
const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middlewares/validar-jwt');
// const {  validarCampos } = require('../middlewares/validar-campos');
//Eliminar Tecnicos
tecnicoRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const tecnico = yield tecnico_model_1.Tecnico.findById(id);
        if (!tecnico) {
            return res.status(404).json({
                ok: true,
                msg: 'Tecnico no encontrada por identificador'
            });
        }
        yield tecnico_model_1.Tecnico.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Tecnico eliminado'
        });
        //hhs
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
//Obetner Tecnicos
tecnicoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tecnico = yield tecnico_model_1.Tecnico.find()
        .populate('admin', 'nombre img')
        .populate('sede', 'nombre img');
    res.json({
        ok: true,
        tecnico
    });
}));
//Actualizar Tecnicos
tecnicoRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const _id = req._id;
    try {
        const tecnico = yield tecnico_model_1.Tecnico.findById(id);
        if (!tecnico) {
            return res.status(404).json({
                ok: true,
                msg: 'Tecnico no encontrada por identificador'
            });
        }
        const cambioTecnico = Object.assign(Object.assign({}, req.body), { admin: _id });
        const TecnicoActualizado = yield tecnico_model_1.Tecnico.findByIdAndUpdate(id, cambioTecnico, { new: true });
        res.json({
            ok: true,
            msg: 'Actualizando tecnico',
            tecnico: TecnicoActualizado
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
//Crear Tecnico
tecnicoRouter.post('/', [
    validarJWT,
    // validarCampos,
    express_validator_1.check('nombre', 'El tecnico del tecnico es obligatorio').not().isEmpty(),
    express_validator_1.check('sede', 'La sede id debe de ser obligatorio').isMongoId(),
], (req, res = express_1.response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const tecnico = new tecnico_model_1.Tecnico(Object.assign({ admin: id }, req.body));
    try {
        const tecnicoDB = yield tecnico.save();
        res.json({
            ok: true,
            tecnico: tecnicoDB
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}));
module.exports = tecnicoRouter;
