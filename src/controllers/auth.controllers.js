import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    const token = await createToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      mensaje: "se guardo todo y resiviste el token prro",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        mensaje: "valio pito no te registrates y no reciviste el token",
      });
  }
};

export const login = async (req, res) => {
    const { username, password, email } = req.body;
    try {

      const usuarioEncontrado = await User.findOne({email})  
    if(!usuarioEncontrado){ res.json({mensaje: "no se encontro al usuario prro"}) }


      const isMatch = await bcrypt.compare(password, usuarioEncontrado.password);
      if(!isMatch){ res.status(404).json({mensaje:"no se encontro al usuario"})}
  
       
  
      const token = await createToken({ id: usuarioEncontrado._id });

      
  
      res.cookie("token", token);
      res.json({
        mensaje: "se guardo todo y resiviste el token en login",
      });
      
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({
          mensaje: "valio pito no te registrates y no reciviste el token",
        });
    }
  };


  export const logout = (req,res)=>{
    res.cookie("token", "",{
        expires: new Date(0)
    })
    res.json({message:"estas deslogeado ya"})
  }


  export const profile = async(req, res)=>{
    const usuarioEncontrado = await User.findById(req.user.id)
    if(!usuarioEncontrado) return res.status(404).json({mensaje: "usuario no encontrado en la base de datos"})
    console.log(usuarioEncontrado)
    res.json({
      id: usuarioEncontrado._id,
      username: usuarioEncontrado.username,
      email: usuarioEncontrado.email
    })



  }