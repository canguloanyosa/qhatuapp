import { Schema, Document, model} from 'mongoose';

const NotificacionSchema = new Schema({
    created: {
        type: Date
    },
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        required: true,
        type: String
    },
    portada: {
        type: String,
        default: ''
    },
    userId: {
        type: String
    },
    pushId: {
        type: String
    },
    url: {
        type: String
    }
    
},   { collection: 'notificaciones' } );


NotificacionSchema.method('toJSON', function() {
    const {__v, ...Object } = this.toObject();
    return Object;
})

NotificacionSchema.pre<INotificacion>('save', function( next ) {
    this.created = new Date();
    next();
});

interface INotificacion extends Document {
    created: Date;
    titulo: string;
    descripcion: string;
    portada: string;
    url: string;
    userId: string;
    pushId: string;
}

export const Notificacion = model<INotificacion>('Notificacion', NotificacionSchema);