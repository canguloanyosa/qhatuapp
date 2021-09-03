import { Photo } from "../models/photo.model";
import { Router, Response } from "express";

const cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'amazonastrading', 
    api_key: '921375412961546',
    api_secret: 'mm8GUA4-e2Ck1g6XdJWq5oKjsWc'
});

const photoRoutes = Router();

//Obtener PHOTOS
photoRoutes.post('/',  async (req: any, res: Response)=> {
    const { tempFilePath } =  req.files.imagePath;
    const resp = await cloudinary.uploader.upload(tempFilePath,{folder:"qhatu"});
    const pathUrl = resp.secure_url;
    const photo = {
        imagePath: pathUrl
    }
    const photos = new Photo(photo);
    await photos.save();

    return res.json({
        ok: true,
        msg: 'Publicado',
        photo
    });

});



photoRoutes.get('/',  async (req: any, res: Response)=> {
    const desde = Number(req.query.desde)  || 0;
    const [photo, total] = await Promise.all([
                            Photo.find()
                            .sort({_id: -1})
                            .skip( desde)
                            .limit(12),
                            Photo.countDocuments
                        ]);
    res.json({
        ok: true,
        total,
        photo,
        id: req.id
    });
});



//Borrar photo
photoRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;
    Photo.findByIdAndRemove(id, (err, photo ) => {
        if(err) throw err;
        res.json({
            ok: true,
            mensaje: 'Photo Eliminado',
            body: photo
        })
    }); 
});




export default photoRoutes;