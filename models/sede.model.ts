import { Schema, Document, model} from 'mongoose';

const SedeSchema = new Schema({
    nombre: {
         type: String,
         required: true
    },
    direccion: {
        type: String
    },
    telefono: {
        type: String
    },
    mapa: {
        type: String
    },
},   { collection: 'sedes' } );


SedeSchema.method('toJSON', function() {
    const {__v, ...Object } = this.toObject();
    return Object;
})

interface ISede extends Document {
    nombre: string;
    img: string;
    direccion: string;
    telefono: string;
    mapa: string;
}

export const Sede = model<ISede>('Sede', SedeSchema);