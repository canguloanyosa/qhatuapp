import { Router, Request, Response, response } from "express";
import { User } from "../models/user.model";
import  bcrypt  from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";
import  nodemailer  from "nodemailer";

const user1Routes = Router();
const { generarJWT } = require ('../helpers/jwt'); 







//Iniciar Sesion con Google
user1Routes.post('/login/google', async (req, res = response) => {

    
    const user = {
        nombre: req.body.nombre,
        dni: req.body.dni,
        email: req.body.email,
        perfil: req.body.perfil,
        password: req.body.password,
        idGoogle: req.body.idGoogle,
        
    };




    try {

        const { nombre, email , dni ,perfil, password, idGoogle } = await user;
        const userDB = await User.findOne({idGoogle});
        
    
                 
        let usuario;


        if(!userDB) {
          
            
            usuario = new User({
                nombre: nombre,
                dni: dni,
                email: email,
                perfil: perfil,
                password: '@@@',
                idGoogle: idGoogle,
                google: true,
            });
        

    

        } else {
            //existe usuario
            usuario = userDB;
            usuario.google = true

        }

        // Guardar en Base de datos

        await usuario.save();

        const token = await Token.getJwtToken(usuario.id);

        

        res.json({
            ok: true,
            msg: 'Google Login',
            user,
            token 
        });

    } catch {

        res.status(401).json({
            ok: false,
            msg: 'Ups Error'
        })

    }


   

});


export default user1Routes;