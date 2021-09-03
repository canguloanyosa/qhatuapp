import { Schema, Document, model} from 'mongoose';
const AdminSchema = new Schema({
    nombre: {
         type: String,
         required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    password_show: {
        type: String,
    },
    img: {
        type: String,
        default: 'https://admin.amazonastrading.com.pe/resources/images/icono-app.png'
        
    },
    role: {
        type: String,
        required: true,
        default: '0'
    },
    sedeATP: {
        type: String,
        required: true,
    },
    google: {
        type: Boolean,
        default: false

    },

});


AdminSchema.method('toJSON', function() {
    const {__v, _id, password,...Object } = this.toObject();
    Object.id = _id;
    return Object;
})


interface IAdmin extends Document {
    nombre: string;
    email: string;
    role: string;
    sedeATP: string;
    password: string;
    password_show: string;
    google: Boolean;
}

export const Admin = model<IAdmin>('Admin', AdminSchema);