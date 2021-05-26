import { Schema, Document, model} from 'mongoose';

const servicioSchema = new Schema ({
 
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
    grano: {
        type: String
    },
    
    cantidad: {
        type: String
    },
    
    precio: {
        type: String
    },
    
    
    tecnico: {
        type: String
    },
    comentario: {
        type: String
    },
    estado: {
        type: String
    },
    proceso: {
        type: String,
        default: ''
    }
    ,
    completado: {
        type: String,
        default: ''
    },
    start: {
        type: String,
        default: '0'
    },
    observacion: {
        type: String,
        default: ''
    },
    id_push: {
        type: String,
    }

    ,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }


});



servicioSchema.pre<IServicio>('save', function( next ) {
    this.created = new Date();
    next();
});


interface IServicio extends Document {
    created: Date,
    tipo: string;
    fecha: string;
    sede: string;
    grano: string;
    cantidad: string;
    precio: string;
    tecnico: string;
    comentario: string;
    estado: string;
    start: string;
    usuario: string;
    id_push: string;
}

export const Servicio = model<IServicio>('Servicio', servicioSchema);