import {Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const socioSchema = new Schema({

    nombre: {
        type: String,
    },
    dni: {
        type: String,
        required: [ true, 'El documento de identidad es necesario'],
        unique: true
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
    push: {
        type: String,
        item: null
    }


});



socioSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bcrypt .compareSync(password, this.password)){
        return true;
    }else {
        return false;
    }
});


interface ISocio extends Document {
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
    push: string;
    compararPassword(password: string): boolean;
}

export const Socio = model<ISocio>('Socio', socioSchema);