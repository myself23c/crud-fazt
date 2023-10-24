import mongoose from 'mongoose'

 export const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://juanm23c46:gFTsUnHEOJVLFYuB@cluster0.3p57heu.mongodb.net/")
        console.log("conectado a la base de datos")
    }
    catch(err){
        console.log(err)
    }
}