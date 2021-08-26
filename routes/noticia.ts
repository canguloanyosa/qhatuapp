import { Router, Response, Request } from 'express';
import { Noticia } from "../models/noticia.model";
import { verificaToken } from "../middlewares/autenticacion";



const noticiaRoutes = Router();


noticiaRoutes.get('/', async(req: any, res: Response) => {
    

    let pagina = Number(req.query.pagina)  || 1;
    let skip =   pagina - 1;
    skip = skip * 10;


    const noticias = await Noticia.find()
                                .sort({_id: -1})
                                .skip(skip)
                                .limit(40)
                                .populate('usuario','-password')
                                .exec();
    res.json({
        ok: true,
        pagina,
        noticias
    });
});




//Obetner Usuarios x2
noticiaRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ noticias, total] =  await Promise.all([
                                    Noticia.find()
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Noticia.countDocuments()
    ]);
    res.json({
        ok: true,
        noticias,
        total,
        id: req.id 
    });
});









//Crear POST
noticiaRoutes.post('/', (req: any, res: Response)=> {
       
    const body = req.body;
    body.usuario = req.usuario._id;




    Noticia.create(body).then(async noticiaDB => {
        await noticiaDB.populate('usuario').execPopulate();
        res.json({
            ok: true,
            noticia: noticiaDB
        }); 
    }).catch(err => {
        res.json(err)
    });
} );








// Crear un sipo de solicitud en la seccion NOTICIAS
noticiaRoutes.post('/create', (req: Request, res: Response) => {
    const noticia = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        portada: req.body.portada,
        tipo:  req.body.tipo,

    }

    Noticia.create( noticia).then( noticiaDB => {
        res.json({
            ok: true,
            servicio: noticiaDB
        });


    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});




//Actualizar Servicio Recojo de Cacao
noticiaRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const noticia = {
        titulo: req.body.titulo,
        portada: req.body.portada,
        descripcion: req.body.descripcion,
        color: req.body.color,
        url: req.body.url,
    }
    Noticia.findByIdAndUpdate(id, noticia, {new: true}, (err, noticia) => {
        if(err) throw err;
        if(!noticia){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            
        });noticia
    })
});





// Borrar Noticia 
noticiaRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    Noticia.findByIdAndRemove(id, (err, noticia ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Noticia Eliminada',
            body: noticia
        })
    }); 
});




export default noticiaRoutes;