import { Router, Response, Request } from "express";
import { Version } from "../models/version.model";

const versionRoutes = Router();



//crear version 
versionRoutes.post('/',  (req: any, res: Response ) => {
    const body = req.body;
    Version.create(body).then(VersionDB => {
        res.json ({
            ok:true,
            precio: VersionDB
        });
    }).catch( err => {
        res.json(err)
    });
});


//Obetner version
versionRoutes.get('/', async (req: any, res: Response ) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 1;
    const version = await  Version.find()
                                    .sort({_id: -1})
                                    .skip( skip )
                                    .limit(1)
                                    .exec();
    res.json ({
        ok:true,
        pagina,
        version
    });
    
});


//Obetner Servicios x2
versionRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    const [ version, total] =  await Promise.all([
                                    Version.find()
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Version.countDocuments()
    ]);
    res.json({
        ok: true,
        version,
        total,
        id: req.id 
    });
});

export default versionRoutes;
