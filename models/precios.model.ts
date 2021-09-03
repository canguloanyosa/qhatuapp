import { Schema, Document ,model } from 'mongoose';

const precioSchema = new Schema ({
    created: {
        type: Date
    },
    humedo1: {
        type: Number
    },
    seco1: {
        type: Number
    },
    humedo2: {
        type: Number
    },
    seco2: {
        type: Number
    },
    humedo3: {
        type: Number
    },
    seco3: {
        type: Number
    },
    comentario: {
        type: String
    },
    img: {
        type: String,
        default: ''

    },
    sede: {
        type: String,
        default: 'General'
    }
});

precioSchema.pre<IPrecio>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IPrecio extends Document {
    created: Date;
    humedo1: number;
    seco1: number;
    humedo2: number;
    seco2: number;
    humedo3: number;
    seco3: number;
    comentario: number;
    img: string;
    sede: string;
}

export const Precio = model<IPrecio>('Precio', precioSchema);