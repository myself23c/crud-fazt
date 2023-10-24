import jwt from 'jsonwebtoken'
import {TOKEN_SECRET_KEY} from '../config.js'



export const authRequired = (req,res, next)=>{
    const {token}= req.cookies

    if(!token){return res.status(401).json({
        mensaje:"no estas autirazado por no tener token"
    })}

    jwt.verify(token, TOKEN_SECRET_KEY, (err, decodificado)=>{
        if(err) return res.status(401).json({mensaje: " sigues sin estar autorizadoporque tu token es invalido"})
        req.user =  decodificado
        console.log(decodificado)
        next()
    })

    
}