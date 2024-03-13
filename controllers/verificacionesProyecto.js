import mongoose from "mongoose";
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const verificacionesProyecto = async(req, res, restringido = 1) => {
    const {id} = req.params

    const valid = mongoose.Types.ObjectId.isValid(id)

    if(!valid){
        const error = new Error("Ese proyecto no Existe")
        return res.status(404).json({msg: error.message})
    }

    const proyecto = await Proyecto.findById(id)
                            .populate({path: 'tareas', populate : {path: 'completado', select: 'nombre'}})
                            .populate("colaboradores", "nombre email").exec();

    if(!proyecto){
        const error = new Error("No Encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(restringido === 1){
        if(proyecto.creador.toString() !== req.usuario._id.toString() ){
            const error = new Error("Acción no valida")
            return res.status(401).json({msg: error.message})
        }
    }else{
        if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(
            colaborador => colaborador._id.toString() === req.usuario._id.toString()
        )){
            const error = new Error("Acción no valida")
            return res.status(401).json({msg: error.message})
        }
    }
    return proyecto
}

const verificacionesTarea = async(req, res, restringido = 1) => {
    const {id} = req.params

    const valid = mongoose.Types.ObjectId.isValid(id)

    if(!valid){
        const error = new Error("Esa tarea no Existe")
        return res.status(404).json({msg: error.message})
    }

    const tarea = await Tarea.findById(id).populate("proyecto").exec()
    // console.log(id)
    if(!tarea){
        const error = new Error("Esa tarea no existe")
        return res.status(404).json({msg: error.message})
    }

    if(restringido === 1){
        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error("Acción no valida")
            return res.status(403).json({msg: error.message})
        }
    } else{
        if(
            tarea.proyecto.creador.toString() !== req.usuario._id.toString() && 
            !tarea.proyecto.colaboradores.some(colaborador =>  colaborador._id.toString() === req.usuario._id.toString())
        ){
            const error = new Error("Acción no valida")
            return res.status(403).json({msg: error.message})
        }
    }

    return tarea
}
const verificacionesProyectoTarea = async(req, res) => {
    const {proyecto} = req.body

    const valid = mongoose.Types.ObjectId.isValid(proyecto)

    if(!valid){
        const error = new Error("Ese proyecto no Existe")
        return res.status(404).json({msg: error.message})
    }

    const existeProyecto = await Proyecto.findById(proyecto).exec();
    // console.log(id)
    if(!existeProyecto){
        const error = new Error("Ese proyecto no existe")
        return res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no valida")
        return res.status(403).json({msg: error.message})
    }

    return existeProyecto
}

export {
    verificacionesProyecto,
    verificacionesProyectoTarea,
    verificacionesTarea 
}