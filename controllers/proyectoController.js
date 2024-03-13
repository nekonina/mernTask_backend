
import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";
import { verificacionesProyecto } from "./verificacionesProyecto.js";

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        $or:[
            {colaboradores: {$in: req.usuario}},
            {creador: {$in: req.usuario}},
        ]
    }).select("-tareas")
    res.json(proyectos)
};

const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
};

const obtenerProyecto = async (req, res) => {
    const proyecto = await verificacionesProyecto(req, res,0)

    if(!proyecto.outputData) res.json(proyecto)
    
};

const editarProyecto = async (req, res) => {
    const proyecto = await verificacionesProyecto(req, res)

    if(!proyecto.outputData){
        proyecto.nombre = req.body.nombre || proyecto.nombre
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion
        proyecto.cliente = req.body.cliente || proyecto.cliente
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega

        try {
            const proyectoActualizado = await proyecto.save()
            res.json(proyectoActualizado)
        } catch (error) {
            console.log(error)
        }
    }
};

const eliminarProyecto = async (req, res) => {

    const proyecto = await verificacionesProyecto(req, res)
    if(!proyecto.outputData){
        try {
            await proyecto.deleteOne();
            res.json({msg: "Proyecto Eliminado"})
        } catch (error) {
            
        }
    }
};

const buscarColaborador = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select(
        "-confirmado -createdAt -password -token -updatedAt -__v"
    )
    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    return res.json(usuario)

};

const agregarColaborador = async (req, res) => {
    const proyecto = await verificacionesProyecto(req, res)
    if(!proyecto.outputData){ 
        const {email} = req.body
        const usuario = await Usuario.findOne({email}).select(
            "-confirmado -createdAt -password -token -updatedAt -__v"
        )
        if(proyecto.creador.toString() === usuario._id.toString()){
            const error = new Error("El creador del proyecto no puede ser colaborador")
            return res.status(404).json({msg: error.message})
        }
        if(proyecto.colaboradores.includes(usuario._id)){
            const error = new Error("Ese usuario ya es colaborador del proyecto")
            return res.status(404).json({msg: error.message})
        }
        proyecto.colaboradores.push(usuario._id)
        await proyecto.save()
        return res.status(200).json({msg:'Colaborador agregado correctamente'})
    }

};

const eliminarColaborador = async (req, res) => {
    const proyecto = await verificacionesProyecto(req, res)
    if(!proyecto.outputData){ 
        proyecto.colaboradores.pull(req.body.id)
        await proyecto.save()
        return res.status(200).json({msg:'Colaborador eliminado correctamente'})
    }
};


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
}