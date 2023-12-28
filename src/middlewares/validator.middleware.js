export const validateSchema = (schema ) => (req,res,next)=>{
    try{
        schema.parse(req.body);
        next()
    }catch(e){console.log(e)
    return res.status(400).json({e})
}
}