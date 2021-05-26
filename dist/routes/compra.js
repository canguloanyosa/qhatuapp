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
const vapiKeys = {
    "publicKey": "BIDiVIeBDfQJ-ei7iFOu1WJAA1l-YcFvBXRQQa-B-sMWMig9-qoFs14cYNTXew5fN_2efPbbNPIVIsUTnPN4pzs",
    "privateKey": "7aWWZsodXTB8mddZNCmHXMnqoH-zxqmtr6JVIGf8Sc4"
};
// webpush.setVapiDetails(
//     'mailto:example@yourdoimain.org',
//     vapiKeys.publicKey,
//     vapiKeys.privateKey
// );
compraRoutes.post('/pushweb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pushSubscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/fzXK7np3dPw:APA91bFuA4QRkK4KPY_OBPr66XDeJ9bi44kC16Q6CJRYKp_v_GhJ4Nmiirzxa7cPX7GwRiQstzwaryT29Z1k5tm79zlrACBj9H58l6fT6B-hHkF-IxVPPYJniAvWvUH4H3q3gzn68Yn_',
        keys: {
            auth: 'IipD6jHeubrEQhc6c-M-Fw',
            p256dh: 'BHdbTYCma41_YX0UBp6de8xeOBcXs5gLbNOUI14vDSs86UGiQ4cMgyeQsnibhvXXmOadlZ-EzCESchjme_wIq-U'
        }
    };
    const payload = {
        "notification": {
            "title": "Titulo prueba",
            "body": "Descripcion de la notificaion de compra.",
            "vibrate": [100, 50, 100],
            "image": "https://admin.amazonastrading.com.pe/resources/images/notifications.png",
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1,
            },
            "actions": [{
                    "action": "explore",
                    "title": "Go to the site",
                }]
        }
    };
    webpush.sendNotification(pushSubscription, JSON.stringify(payload)).then(() => {
        res.status(200).json({ msg: 'Notifications sent!' });
    });
}));
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
        // ok: true,
        pagina,
        compras
    });
}));
//
//Obtener Compras Paginados
compraRoutes.get('/listar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
//Obetner 10 precios
compraRoutes.get('/10', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    const [compras, total] = yield Promise.all([
        compra_model_1.Compra.find({})
            .sort({ _id: -1 })
            // .populate('usuario', 'nombre celular email dni avatar')
            .skip(desde)
            .limit(10),
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
    // console.log(desde);
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
//Obetner Usuarios TODOS
// servicioRoutes.get('/exportar', async (req: any, res: any) => {
//     const [ servicios ] =  await Promise.all([
//                                     Servicio.find()
//                                     .sort({_id: -1})    
//     ]);
//     res.json({
//         ok: true,
//         servicios,
//     });
// });
exports.default = compraRoutes;
