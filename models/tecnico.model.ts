import { Usuario } from "./usuario.model";
import { Schema, Document, model} from 'mongoose';
import  bcrypt  from 'bcrypt';

const TecnicoSchema = new Schema({
    nombre: {
         type: String,
         required: true
    },
    img: {
        type: String
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    sede: {
        type: Schema.Types.ObjectId,
        ref: 'Sede',
        required: true
    },
});


TecnicoSchema.method('toJSON', function() {
    const {__v, ...Object } = this.toObject();
    return Object;
})


interface ITecnico extends Document {
    nombre: string;
    img: string;
}

export const Tecnico = model<ITecnico>('Tecnico', TecnicoSchema);