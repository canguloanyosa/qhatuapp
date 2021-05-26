import jwt from 'jsonwebtoken';
export default class TokenSocio {

    private static seed: string = 'este-es-el-seed-de-clave-secreta-02';
    private static caducidad:string = '300d';

    constructor(){}

    static getJwtToken(payload: any): string {
        return jwt.sign({
            socio: payload
        }, this.seed,{expiresIn: this.caducidad});
    }

    static comprobarToken(socioToken: string){
        return new Promise((resolve, reject) => {
            jwt.verify( socioToken, this.seed, (err, decoded) => {
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

