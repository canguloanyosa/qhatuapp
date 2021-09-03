import { Schema, Document, model} from 'mongoose';

const noticiaSchema = new Schema ({
    created: {
        type: Date
    },
    titulo:  {
        type: String
    },
    portada: {
        type: String
    },
    descripcion: {
        type: String
    },
    color: {
        type: String
    },
    url: {
        type: String
    },
    descripcioncompleta: {
        type: String
    }

});

noticiaSchema.pre<INoticia>('save', function( next ) {
    this.created = new Date();
    next();
});

interface INoticia extends Document {
    created: Date;
    titulo: string;
    portada: string;
    descripcion: string;
    url: string;
    color: string;
    descripcioncompleta: string;
}

export const Noticia = model<INoticia>('Noticia', noticiaSchema);