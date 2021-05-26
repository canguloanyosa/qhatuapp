import {Response, Request, NextFunction} from 'express'; 
import TokenQR from '../classes/tokenQR';


export const verificaTokenQR = (req: any, res: Response, next:NextFunction) => {
    const userToken = req.get('x-token') || '';
    TokenQR.comprobarTokenQR(userToken)
    .then((decoded: any) => {
        console.log('Decoded', decoded);
       req.usuario= decoded.usuario; 
       next();
    })
    .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto',
        });
    });
}