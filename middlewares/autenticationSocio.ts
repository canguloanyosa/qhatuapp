import {Response, Request, NextFunction} from 'express'; 
import TokenSocio from '../classes/tokenSocio';


export const verificaTokenSocio = (req: any, res: Response, next:NextFunction) => {
    const socioToken = req.get('x-token') || '';
    TokenSocio.comprobarToken(socioToken)
    .then((decoded: any) => {
        console.log('Decoded', decoded);
       req.socio= decoded.socio; 
       next();
    })
    .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto',
        });
    });
}