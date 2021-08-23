import { Schema, Document, model} from 'mongoose';


var mongoose = require('mongoose');  // 1. require mongoose
var autoIncrement = require('mongoose-auto-increment');

const compraSchema = new Schema ({
 
    created: {
        type: Date
    },
    dni: {
        type: String
    },
    id_cliente: {
        type: String
    },
    nombre: {
        type: String
    },
    farmerid: {
        type: String
    },
    avatar: {
        type: String
    },
    email: {
        type: String
    },
    celular: {
        type: String
    },
    precio: {
        type: String
    },
    precioold: {
        type: String
    },
    cantidad: {
        type: String
    },
    address: {
        type: String
    },
    tipo: {
        type: String
    },
    total: {
        type: String
    },
    foto: {
        type: String
    },
    firma: {
        type: String
    },
    sede: {
        type: String
    },
    calificacion: {
        type: String
    },
    estado: {
        type: String
    },
    push_cliente: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    socio: {
        type: Schema.Types.ObjectId,
        ref: 'Socio',
        required: [true, 'Debe existir una referencia a un socio']
    }

});



compraSchema.pre<ICompra>('save', function( next ) {
    this.created = new Date();
    next();
});


interface ICompra extends Document {
    _id: string;
    created: Date,
    dni: string;
    id_cliente: string;
    push_cliente: string;
    nombre: string;
    avatar: string;
    email: string;
    celular: string;
    precio: string;
    cantidad: string;
    address: string;
    socio: string;
    tipo: string;
    total: string;
    foto: string;
    firma: string;
    sede: string;
    latitude: string;
    longitude: string;
    calificacion: string;
    estado: string;
    farmerid: string;
    precioold: string;
}
//FF


autoIncrement.initialize(mongoose.connection); // 3. initialize autoIncrement 
compraSchema.plugin(autoIncrement.plugin, 'Compra'); 

export const Compra = model<ICompra>('Compra', compraSchema);