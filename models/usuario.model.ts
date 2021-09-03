import {Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
var mongoose = require('mongoose');  // 1. require mongoose

const usuarioSchema = new Schema({

    nombre: {
        type: String,
    },
    dni: {
        type: String,
        unique: true,
        required: [ true, 'El documento de identidad es necesario']
    },
    password: {
        type: String,
    },
    password_show: {
        type: String,
        item: null
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    celular: {
        type: String,
        item: null
    },
    ubicacion: {
        type: String,
        item: null
    },
    departamento: {
        type: String,
        item: null
    },
    provincia: {
        type: String,
        item: null
    },
    region: {
        type: String,
        item: null
    }, 
    avatar: {
        type: String,
        default: 'av-10.png'
    },
    perfil: {
        type: String,
    },
    push: {
        type: String,
    },
    farmerid: {
        type: String,
        default: 'FID0000'
    },
    sede: {
        type: String,
        default: 'General'
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/amazonastrading/image/upload/v1630099731/avatars/none_idnj9j.png'
    }


});



usuarioSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bcrypt .compareSync(password, this.password)){
        return true;
    }else {
        return false;
    }
});




interface IUsuario extends Document {
    nombre: string;
    avatar: string;
    dni: string;
    password: string;
    password_show: string;
    email: string;
    celular: string;
    ubicacion: string;
    departamento: string;
    provincia: string;
    region: string;
    sede: string;
    perfil: String;
    farmerid: string;
    push: string;
    photo: string;
    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
