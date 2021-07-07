import { Schema, Document ,model } from 'mongoose';

const preciosedeSchema = new Schema ({

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
    }



});

preciosedeSchema.pre<IPrecioSede>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IPrecioSede extends Document {
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

export const PrecioSede = model<IPrecioSede>('PricioSede', preciosedeSchema);