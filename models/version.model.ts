import { Schema, Document, model} from 'mongoose';
import  bcrypt  from 'bcrypt';

const VersionSchema = new Schema({
    
    num_version: {
        type: String,
        required: true
    },
    descripcion: {
         type: String,
         required: true
    },
    url: {
        type: String
    },
    plataforma: {
        type: String
    },
    lock: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date
    }
    
},   { collection: 'version' } );


VersionSchema.method('toJSON', function() {
    const {__v, ...Object } = this.toObject();
    return Object;
})


VersionSchema.pre<IVersion>('save', function( next ) {
    this.fecha = new Date();
    next();
});

interface IVersion extends Document {
    num_version: string;
    descripcion: string;
    url: string;
    plataforma: string;
    lock: string;
    fecha: Date;
}

export const Version = model<IVersion>('Version', VersionSchema);