import { Schema, model, Document} from 'mongoose';

const schema = new Schema({
    created: {
        type: Date
    },
    // title: {
    //     type: String
    // },
    // description: {
    //     type: String
    // },
    imagePath: {
        type: String
    }
});


interface IPhoto extends Document {
    // title: string;
    // description: string;
    created: Date;
    imagePath: string;
}

export const Photo = model<IPhoto>('Photo', schema);
