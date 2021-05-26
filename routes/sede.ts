import { Router, Response, Request, response } from 'express';
import { check, validationResult } from 'express-validator';
const sedeRouter = Router();
import { Sede } from "../models/sede.model";
import  bcrypt  from 'bcrypt';
const { generarJWT } = require ('../helpers/jwt'); 
const { validarJWT } = require('../middlewares/validar-jwt');
import { Admin } from '../models/admin.model';







//Obetner Sedes
sedeRouter.get('/', async (req: any, res: any) => {
    const sede = await Sede.find()
                                .populate('admin','nombre img');
    res.json({
        ok: true,
        sede
    });
});



//Obetner Servicios x2
sedeRouter.get('/obtener', async (req: any, res: any) => {
    const desde =  Number(req.query.desde) || 0;
    // console.log(desde);



    const [ sede, total] =  await Promise.all([
                                    Sede.find()
                                    .sort({_id: -1})          
                                    // .populate('usuario', 'nombre celular email dni avatar')
                                    .skip( desde )
                                    .limit( 5 ),
                                    Sede.countDocuments()
    ]);
    res.json({
        ok: true,
        sede,
        total,
        id: req.id 
    });
});












//Eliminar Sedes
sedeRouter.delete('/:id', async (req: any, res: any) => {

    const id = req.params.id;

    try {
        const sede = await Sede.findById(id);

        if(!sede) {
            return res.status(404).json({
                ok: true,
                msg: 'Sede no encontrada por identificador'
            });
        }

        await Sede.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Sede eliminado'
        });
        

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});




//Actualizar Sedes
sedeRouter.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre de la sede es obligatorio').not().isEmpty(),
    ],
    async (req: any, res: any) => {


    const id = req.params.id;
    const _id = req._id;

    try {


        const sede = await Sede.findById(id);

        if(!sede) {
            return res.status(404).json({
                ok: true,
                msg: 'Sede no encontrada por identificador'
            });
        }

        const cambioSede = {
            ...req.body,
            admin: _id
        }

        const sedeActualizado = await Sede.findByIdAndUpdate(id, cambioSede, { new: true});



        res.json({
            ok: true,
            msg: 'Actualizando sede',
            sede: sedeActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }



   
});






//Crear Sedes
sedeRouter.post('/',   
    [
        check('nombre', 'El nombre de la sede es obligatorio').not().isEmpty(),
    ],
    async (req: any, res = response) => { 

    const id = req.id;
    const sede = new Sede({
        admin: id,
        ...req.body
    });
    

    try {

        const sedeDB = await  sede.save();

        res.json({
            ok: true,
            sede: sedeDB
        });
    } catch(error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }    
});



module.exports =  sedeRouter;