import { Schema, Document, model} from 'mongoose';

const propiedadesSchema = new Schema ({

    codigo: {
        type: String
    },
    altitud: {
        type: String
    },
    precipitacion: {
        type: String
    },
    temperatura: {
        type: String
    },
    hectareas: {
        type: String
    },
    direccion: {
        type: String
    },
    latitud: {
        type: String
    },
    longitud: {
        type: String
    },
    descripcion:{
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
    
});




interface IPropiedades extends Document {
    codigo: string;
    altitud: string;
    precipitacion: string;
    temperatura: string;
    hectareas: string;
    latitud: string;
    longitud: string;
    direccion: string;
    descripcion: string;
    usuario: string;
}

export const Propiedades = model<IPropiedades>('Propiedades', propiedadesSchema);