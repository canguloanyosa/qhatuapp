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
const photo_model_1 = require("../models/photo.model");
const express_1 = require("express");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'amazonastrading',
    api_key: '921375412961546',
    api_secret: 'mm8GUA4-e2Ck1g6XdJWq5oKjsWc'
});
const photoRoutes = express_1.Router();
//Obtener PHOTOS
photoRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tempFilePath } = req.files.imagePath;
    const resp = yield cloudinary.uploader.upload(tempFilePath, { folder: "qhatu" });
    const pathUrl = resp.secure_url;
    const { title, description } = req.body;
    const photo = {
        // title: title,
        // description: description,
        imagePath: pathUrl
    };
    const photos = new photo_model_1.Photo(photo);
    yield photos.save();
    return res.json({
        // ok: true,
        msg: 'Publicado',
        photo
    });
}));
photoRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Number(req.query.desde) || 0;
    // let skip =   pagina - 1;
    // skip = skip * 10;
    const [photo, total] = yield Promise.all([
        photo_model_1.Photo.find()
            .sort({ _id: -1 })
            .skip(desde)
            .limit(12),
        photo_model_1.Photo.countDocuments
    ]);
    res.json({
        ok: true,
        total,
        photo,
        id: req.id
    });
}));
//Borrar photo
photoRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;
    photo_model_1.Photo.findByIdAndRemove(id, (err, photo) => {
        if (err)
            throw err;
        res.json({
            ok: true,
            mensaje: 'Photo Eliminado',
            body: photo
        });
    });
});
exports.default = photoRoutes;
