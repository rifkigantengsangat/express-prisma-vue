import prisma from "../prisma/index.js"
import bcrypt from 'bcrypt'
import { registerValidator } from "../Validasi/UserValidation.js";
export const UserRegister  =async (req,res)=>{
    const {username,email,password} = req.body;
    const saltRounds = 10;
    const oldEmail = await prisma.user.findFirst({
        where:{
            email : email
        }
    })
    console.log(oldEmail)
    const hashingPassword = bcrypt.hashSync(password,saltRounds)
     try {
        if(oldEmail){
            return res.status(404).json({message:'email already in use'})
        }
        if(registerValidator(username, email, password) === -1){
          return res.status(403).json({
            status: '403',
            message : "Invalid username or password provided"
          })
        }
        if(registerValidator(username, email, password) === -2){
            return res.status(403).json({
              status: '403',
              message : "Email Not Valid"
            })
            
          }
          if(registerValidator(username, email, password) === -3){
            return res.status(403).json({
              status: '403',
              message : "PAswword Must Upparcase lowercase number and Symbol"
            })
          }
          if(registerValidator(username, email, password) === -4){
            return res.status(403).json({
              status: '403',
              message : "Email Already In Database"
            })
          }
          const user = await prisma.user.create({
            data : {
                username,
                email,
                password : hashingPassword,
            }
          })
          return res.status(200).json({
            status:'succeess',
            data : user
          })
     } catch (error) {
        return res.status(404).send({message : error.message});
     }
}
export const userLogin =async (req, res) => {
   const user = await prisma.user.findFirst({
    where:{
        email :req.body.email
    }
   })
   const comparePassword = bcrypt.compareSync(req.body.password,user.password);
   if(!comparePassword) return res.status(401).json({message: 'Password mismatch'})
}