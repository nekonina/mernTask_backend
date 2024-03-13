import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'
import {emailRegistro, emailCambioClave} from '../helpers/email.js'


const registrar = async (req, res) => {

    const {email} = req.body

    const existeUsuario = await Usuario.findOne({email:email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }
    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId();
        await usuario.save()

        //Enviar el email de conformacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({msg:"Usuario creado correctamente, Revisa tu email para confirmar tu cuenta"})
    } catch (error) {
        console.log(error)
    }
    
}

const autenticar = async (req, res) => {

    const {email, password} = req.body;

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(400).json({msg: error.message});
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message});
    }

    //comprobando el password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    }else{
        const error = new Error("Las credenciales no son validas")
        return res.status(403).json({msg: error.message});
    } 
}

const confirmar = async (req, res) => {
   const {token}  = req.params;
   const usuarioConfirmar = await Usuario.findOne({token})

   if(!usuarioConfirmar){
        const error = new Error("Token no valido")
        return res.status(403).json({msg: error.message});
   }

   try {
    usuarioConfirmar.confirmado = true
    usuarioConfirmar.token = ''
    await usuarioConfirmar.save();
    res.json({msg: "Usuario confirmado Correctamente"})
   } catch (error) {
    console.log(error)
   }
}

const cambiarPassword = async (req, res) => {
    const {email} = req.body;

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(400).json({msg: error.message});
    }

    try {
        usuario.token = generarId()
        await usuario.save();
        //Enviar correo
        emailCambioClave({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({msg:"Hemos enviado un email con las instrucciones para cambiar la contraseña"})
    } catch (error) {
        console.log(error)
    }
 }

 const comprobarToken = async (req, res) => {
    const {token} = req.params

    //comprobar si el usuario existe
    const tokenValido = await Usuario.findOne({token})
    if(!tokenValido){
        const error = new Error("El token no es valido")
        return res.status(400).json({msg: error.message});
    }

    try {
        res.json({msg:"Token valido y el usuario existe"})
    } catch (error) {
        console.log(error)
    }
 }

 const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body
    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({token})
    if(!usuario){
        const error = new Error("El token no es valido")
        return res.status(400).json({msg: error.message});
    }

    try {
        usuario.password = password;
        usuario.token = '';
        await usuario.save()
        res.json({msg: "Se ha actualizado el password correctamente"})
    } catch (error) {
        console.log(error)
    }
 }

 const getPerfil = async (req, res) => {
    const {usuario} = req
    res.json(usuario)
 }

export {
    registrar,
    autenticar,
    confirmar,
    cambiarPassword,
    comprobarToken,
    nuevoPassword,
    getPerfil
}