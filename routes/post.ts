import { Router, Response, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";



const postRoutes = Router();



//Obtener POST Paginados
postRoutes.get('/',  async (req: any, res: Response)=> {

    let pagina = Number(req.query.pagina)  || 1;
    let skip =   pagina - 1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({_id: -1})
                            .skip( skip)
                            .limit(10)
                            .populate('usuario','-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        posts
    });
});





//Crear POST
postRoutes.post('/', [verificaToken], (req: any, res: Response)=> {
        const body = req.body;
        body.usuario = req.usuario._id;
        Post.create(body).then(async postDB => {
            await postDB.populate('usuario').execPopulate();
            res.json({
                ok: true,
                post: postDB
            });
        }).catch(err => {
            res.json(err)
        });
} );



// Agregar comentario
postRoutes.post('/update/:id', (req: any, res: Response) => {
    const id=req.params.id;
    const post = {
        respuestas: req.body.respuestas,
    }
    Post.findByIdAndUpdate(id, post, {new: true}, (err, post) => {
        if(err) throw err;
        if(!post){
            return res.json({
                ok:false,
                mensaje: 'Invalid data'
            })
        }
        res.json({
            ok: true,
            post
        });post
    })
});





export default postRoutes;