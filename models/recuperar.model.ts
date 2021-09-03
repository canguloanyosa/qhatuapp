import {Schema, model, Document } from 'mongoose';

const recuperarSchema = new Schema({

    created: {
        type: Date
    },
    email: {
        type: String,
        required: [ true, 'El documento de identidad es necesario']
    },
    nombre: {
        type: String,
    },
    dni: {
        type: String,
        required: [ true, 'El documento de identidad es necesario']
    },
    userId: {
        type: String,
        item: null
    },
    mensaje: {
        type: String,
    },
    estado: {
        type: String,
        default: '0'
    }
});


recuperarSchema.pre<IRecuperar>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IRecuperar extends Document {
    created: Date,
    email: string;
    dni: string;
    userId: string;
    nombre: string;
    mensaje: string;
    estado: string;
}

export const Recuperar = model<IRecuperar>('Recuperar', recuperarSchema);