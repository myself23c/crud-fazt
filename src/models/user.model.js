import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email:{
        type: String,
        trim: true
    },
    password:{
        type: String,
        trim: true
    }
},{
    timestamps: true
})

 const User = mongoose.model("User", userSchema )
 export default User