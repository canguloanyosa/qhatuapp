import { Schema, Document, model} from 'mongoose';

const servicio2Schema = new Schema ({
    
    created: {
        type: Date
    },
    tipo: {
        type: String
    },
    fecha: {
        type: String
    },
    sede: {
        type: String
    },
    actividad: [{
        type: String
    }],
    asunto: {
        type: String
    },
    comentario: {
        type: String
    },
    proceso: {
        type: String,
        default: ''
    },
    completado: {
        type: String,
        default: ''
    },
    observacion: {
        type: String,
        default: ''
    },
    start: {
        type: String,
        default: '0'
    },
    estado: {
        type: String
    },
    id_push: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});

servicio2Schema.pre<IServicio2>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IServicio2 extends Document {
    created: Date;
    tipo: string;
    fecha: string;
    sede: string;
    actividad: string[];
    asunto: string;
    comentario: string;
    estado: string;
    start: string;
    usuario: string;
    id_push: string;
}

export const Servicio2 = model<IServicio2>('Servicio2', servicio2Schema);