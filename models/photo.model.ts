import { Schema, model, Document} from 'mongoose';

const schema = new Schema({
    created: {
        type: Date
    },
    imagePath: {
        type: String
    }
});


schema.pre<IPhoto>('save', function( next ) {
    this.created = new Date();
    next();
});


interface IPhoto extends Document {
    created: Date;
    imagePath: string;
}

export const Photo = model<IPhoto>('Photo', schema);
