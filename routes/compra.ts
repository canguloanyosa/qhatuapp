import { Router, Response, Request } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Compra } from "../models/compra.model";
import { verificaTokenSocio } from '../middlewares/autenticationSocio';

const webpush = require('web-push');



const compraRoutes = Router();


const vapiKeys = {
    "publicKey":"BIDiVIeBDfQJ-ei7iFOu1WJAA1l-YcFvBXRQQa-B-sMWMig9-qoFs14cYNTXew5fN_2efPbbNPIVIsUTnPN4pzs",
    "privateKey":"7aWWZsodXTB8mddZNCmHXMnqoH-zxqmtr6JVIGf8Sc4"
}
    

// webpush.setVapiDetails(
//     'mailto:example@yourdoimain.org',
//     vapiKeys.publicKey,
//     vapiKeys.privateKey
// );




compraRoutes.post('/pushweb', async(req: any, res: Response) => {

     const pushSubscription = {
         endpoint: 'https://fcm.googleapis.com/fcm/send/fzXK7np3dPw:APA91bFuA4QRkK4KPY_OBPr66XDeJ9bi44kC16Q6CJRYKp_v_GhJ4Nmiirzxa7cPX7GwRiQstzwaryT29Z1k5tm79zlrACBj9H58l6fT6B-hHkF-IxVPPYJniAvWvUH4H3q3gzn68Yn_',
         keys: {
             auth: 'IipD6jHeubrEQhc6c-M-Fw',
             p256dh: 'BHdbTYCma41_YX0UBp6de8xeOBcXs5gLbNOUI14vDSs86UGiQ4cMgyeQsnibhvXXmOadlZ-EzCESchjme_wIq-U'
         }
     };

     const payload = {
         "notification": {
             "title": "Titulo prueba",
             "body": "Descripcion de la notificaion de compra.",
             "vibrate": [100, 50, 100],
             "image": "https://admin.amazonastrading.com.pe/resources/images/notifications.png",
             "data": {
                 "dateOfArrival": Date.now(),
                 "primaryKey": 1,
             },
             "actions": [{
                 "action": "explore",
                 "title": "Go to the site",
             }]
         }
     };



     webpush.sendNotification(
         pushSubscription,
         JSON.stringify(payload)).then(() => {
            res.status(200).json({ msg: 'Notifications sent!' });
          });


});







//Obtener compra Paginados
compraRoutes.get('/', async(req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const compras = await Compra.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('socio')
    .exec();


    res.json({
        // ok: true,
        pagina,
        compras
    });
});

//

//Obtener Compras Paginados
compraRoutes.get('/listar', async(req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const compras = await Compra.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('socio')
    .exec();


    res.json({
        ok: true,
        pagina,
        compras
    });
});





//Obetner 10 precios
compraRoutes.get('/10', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    console.log(desde);

    const [ compras, total] =  await Promise.all([
                                    Compra.find({})
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 10 ),
                                    Compra.countDocuments()
    ]);
    res.json({
        ok: true,
        compras,
        total,
        id: req.id 
    });
});





//Obetner Servicios x2
compraRoutes.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    // console.log(desde);



    const [ compra, total] =  await Promise.all([
                                    Compra.find()
                                    .sort({_id: -1})          
                                    .populate('socio', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Compra.countDocuments()
    ]);
    res.json({
        ok: true,
        compra,
        total,
        id: req.id 
    });
});






// Crear una  solicitud en la seccion SERVICIOS
compraRoutes.post('/',  [verificaTokenSocio] , (req: any, res: Response) => {

    const body = req.body
    body.socio = req.socio._id;

    Compra.create(body).then(async compraDB => {
        await compraDB.populate('socio').execPopulate();
        res.json({
            ok: true,
            compras: compraDB
        });
   


    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});






// Actualizar Servicio Recojo de Cacao
compraRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const compra = {
        estado: req.body.estado,
        calificacion: req.body.calificacion,
        // completado: req.body.completado,
        // observacion: req.body.observacion,
        // grano: req.body.grano,
        // sede: req.body.sede,
        // tecnico: req.body.tecnico,
        // comentario: req.body.comentario || req.servicios.comentario,
        // precio: req.body.precio,
        // start: req.body.start,
        // cantidad: req.body.cantidad,
    }
    Compra.findByIdAndUpdate(id, compra, {new: true}, (err, compra) => {
        if(err) throw err;
        if(!compra){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            
        });compra
    })
});



// Borrar Servicio Recojo de cacao
compraRoutes.delete('/:id',    (req: any, res: Response) => {
    const id = req.params.id;

    Compra.findByIdAndRemove(id, (err, compras ) => {
        if(err) throw err;

        res.json({
            ok: true,
            mensaje: 'Compra Eliminada',
            body: compras
        })
    }); 
});





//Obetner Usuarios TODOS
// servicioRoutes.get('/exportar', async (req: any, res: any) => {
//     const [ servicios ] =  await Promise.all([
//                                     Servicio.find()
//                                     .sort({_id: -1})    
//     ]);
//     res.json({
//         ok: true,
//         servicios,
//     });
// });







export default compraRoutes;


