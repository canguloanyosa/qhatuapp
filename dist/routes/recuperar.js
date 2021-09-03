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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recuperar_model_1 = require("../models/recuperar.model");
const recuperarRoutes = express_1.Router();
const nodemailer_1 = __importDefault(require("nodemailer"));
// Crear recuperacion
recuperarRoutes.post('/', (req, res) => {
    const body = req.body;
    recuperar_model_1.Recuperar.create(body).then((recuperarDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield recuperarDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            recuperar: recuperarDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Obetner Servicios x2
recuperarRoutes.get('/obtener', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    const [recuperar, total] = yield Promise.all([
        recuperar_model_1.Recuperar.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(5),
        recuperar_model_1.Recuperar.countDocuments()
    ]);
    res.json({
        ok: true,
        recuperar,
        total,
        id: req.id
    });
}));
//Borrar Servicio Recojo de cacao
recuperarRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    recuperar_model_1.Recuperar.findByIdAndRemove(id, (err, recuperar) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Mensaje Eliminado',
            body: recuperar
        });
    });
});
//Actualizar 
recuperarRoutes.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const recuperar = {
        userId: req.body.userId,
        email: req.body.email,
        nombre: req.body.nombre,
        dni: req.body.dni,
        mensaje: req.body.mensaje
    };
    recuperar_model_1.Recuperar.findByIdAndUpdate(id, recuperar, { new: true }, (err, recuperar) => {
        if (err)
            throw err;
        if (!recuperar) {
            return res.json({
                ok: false,
                mensaje: 'Invalid data'
            });
        }
        res.json({
            ok: true,
            recuperar
        });
        var transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "qhatucacao@gmail.com",
                pass: "@D3v@tP*"
            }
        });
        var mailOptions = {
            from: "qhatucacao@gmail.com",
            to: recuperar.email,
            subject: "RECUPERACIÓN DE CONTRASEÑA QHATU CACAO APP",
            html: `<html><head><title>QHATU CACAO APP 2021</title></head><body><table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='padding: 0'><center><img style='padding: 0; display: block; margin-bottom: -10px' src='https://admin.amazonastrading.com.pe/resources/images/icono-app.png' width='20%'> <br> <br> </center></td></tr><tr><td style='background-color: #ecf0f1'><div style='color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif'><h2 style='color: #e67e22; margin: 0 0 7px'>HOLA ${recuperar.nombre} tus datos fueron recuperados.</h2><p style='margin: 2px; font-size: 15px'> Tus accesos para la plataforma móvil son: </p><ul style='font-size: 15px; margin: 10px 0'>  <br>  <li>DNI: ${recuperar.dni} </li> <li>CLAVE:  ${recuperar.mensaje} </li></ul> <br><div style='width: 100%; text-align: center'> <a href='https://play.google.com/store/apps/details?id=com.amazonastrading.app' target='_blank'> <img src='https://admin.amazonastrading.com.pe/resources/images/disponible-en-google-play-badge.png'  width='30%'> </a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0'>Amazonas Trading Perú SAC</p></div></td></tr></table></body></html>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send(error.message);
            }
            else {
                res.json({
                    ok: true,
                    msg: 'Email enviado'
                });
                console.log("Email enviado");
            }
        });
    });
});
exports.default = recuperarRoutes;
