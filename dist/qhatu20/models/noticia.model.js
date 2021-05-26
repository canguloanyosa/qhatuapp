"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const noticiaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    titulo: {
        type: String
    },
    portada: {
        type: String
    },
    descripcion: {
        type: String
    },
    url: {
        type: String
    },
    descripcioncompleta: {
        type: String
    }
});
noticiaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Noticia = mongoose_1.model('Noticia', noticiaSchema);
