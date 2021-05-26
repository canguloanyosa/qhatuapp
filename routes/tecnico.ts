import { Router, Response, Request, response } from 'express';
import { check, validationResult } from 'express-validator';
const tecnicoRouter = Router();
import { Tecnico } from "../models/tecnico.model";
import { Admin } from "../models/admin.model";
import  bcrypt  from 'bcrypt';
const { generarJWT } = require ('../helpers/jwt'); 
const { validarJWT } = require('../middlewares/validar-jwt');
// const {  validarCampos } = require('../middlewares/validar-campos');






//Eliminar Tecnicos
tecnicoRouter.delete('/:id', async (req: any, res: any) => {

    const id = req.params.id;

    try {
        const tecnico = await Tecnico.findById(id);

        if(!tecnico) {
            return res.status(404).json({
                ok: true,
                msg: 'Tecnico no encontrada por identificador'
            });
        }

        await Tecnico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Tecnico eliminado'
        });
        
        //hhs

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

});












//Obetner Tecnicos
tecnicoRouter.get('/', async (req: any, res: any) => {
    const tecnico = await Tecnico.find()
                                        .populate('admin', 'nombre img')
                                        .populate('sede', 'nombre img');


    res.json({
        ok: true,
        tecnico
    });
});





//Actualizar Tecnicos
tecnicoRouter.put('/:id', async (req: any, res: any) => {


    const id = req.params.id;
    const _id = req._id;


    try {


        const tecnico = await Tecnico.findById(id);

        if(!tecnico) {
            return res.status(404).json({
                ok: true,
                msg: 'Tecnico no encontrada por identificador'
            });
        }

        const cambioTecnico = {
            ...req.body,
            admin: _id
        }

        const TecnicoActualizado = await Tecnico.findByIdAndUpdate(id, cambioTecnico, { new: true});



        res.json({
            ok: true,
            msg: 'Actualizando tecnico',
            tecnico: TecnicoActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }



   
});







//Crear Tecnico
tecnicoRouter.post('/',   
    [
        validarJWT,
        // validarCampos,
        check('nombre', 'El tecnico del tecnico es obligatorio').not().isEmpty(),
        check('sede', 'La sede id debe de ser obligatorio').isMongoId(),
    ],
    async (req: any, res = response) => { 

    const id = req.id;
    const tecnico = new Tecnico({
        admin: id,
        ...req.body
    });
    

    try {

        const tecnicoDB =  await  tecnico.save();

        res.json({
            ok: true,
            tecnico: tecnicoDB
        });
    } catch(error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }    
});




module.exports =  tecnicoRouter;