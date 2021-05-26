import {Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

var mongoose = require('mongoose');  // 1. require mongoose
var autoIncrement = require('mongoose-auto-increment');



const usuarioSchema = new Schema({


    nombre: {
        type: String,
        // required: [true, 'El nombre es necesario'] 
    },
    dni: {
        type: String,
        unique: true,
        required: [ true, 'El documento de identidad es necesario']
    },
    password: {
        type: String,
        // required: [true, 'La contraseña es necesaria']
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
    // google: Boolean;
    // idFb: String;
    // idGoogle: String;
    perfil: String;
    // facebook: Boolean;
    farmerid: string;
    push: string;
    compararPassword(password: string): boolean;
}


// autoIncrement.initialize(mongoose.connection); // 3. initialize autoIncrement 
// usuarioSchema.plugin(autoIncrement.plugin, 'UsuarioNew'); 
// usuarioSchema.plugin(autoIncrement.plugin, 'Usuario'); 
// jdjfjkdsfjksdfdsyyyydd

// export const Usuario = model<IUsuario>('UsuarioNew', usuarioSchema);
export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
