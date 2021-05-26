import jwt from 'jsonwebtoken';
export default class TokenQR {

    private static seed: string = 'este-es-el-seed-de-clave-secreta-02';
    private static caducidad:string = '10s';

    constructor(){}

    static getJwtTokenQR(payload: any): string {
        return jwt.sign({
            usuario: payload
        }, this.seed,{expiresIn: this.caducidad});
    }


    static comprobarTokenQR(userToken: string){
        return new Promise((resolve, reject) => {
            jwt.verify( userToken, this.seed, (err, decoded) => {
                if(err){
                    //no confiar
                    reject();
                }else{
                    //token valido
                    resolve(decoded);
                }
            });
        });
        
    }



    
}

