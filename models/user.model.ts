import {Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';




const userSchema = new Schema({


    nombre: {
        type: String,
        // required: [true, 'El nombre es necesario'] 
    },
    dni: {
        type: String,
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
    google: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: false
    },
    idFb: {
        type: String,
        unique: true,
    },
    idGoogle: {
        type: String,
        unique: true
    },
    perfil: {
        type: String,
    }


});



userSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bcrypt .compareSync(password, this.password)){
        return true;
    }else {
        return false;
    }
});




interface IUser extends Document {
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
    google: Boolean;
    idFb: String;
    idGoogle: String;
    perfil: String;
    facebook: Boolean;
    compararPassword(password: string): boolean;
}



export const User = model<IUser>('User', userSchema);