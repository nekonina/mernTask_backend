import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";
import { verificacionesProyectoTarea, verificacionesTarea } from "./verificacionesProyecto.js";

const agregarTarea = async (req, res) => {
    const existeProyecto = await verificacionesProyectoTarea(req, res)
    if(!existeProyecto.outputData){
        try {
            const tareaNueva = await Tarea.create(req.body)
            existeProyecto.tareas.push(tareaNueva._id)
            await existeProyecto.save()
            res.json(tareaNueva)
        } catch (error) {
            console.log(error)
        }
    }
};

const obtenerTarea = async (req, res) => {    

    const tarea = await verificacionesTarea(req,res);
    if(!tarea.outputData){
        res.json(tarea)
    }
};

const actualizarTarea = async (req, res) => {
    const tarea = await verificacionesTarea(req,res);
    if(!tarea.outputData){
        tarea.nombre= req.body.nombre || tarea.nombre
        tarea.descripcion = req.body.descripcion || tarea.descripcion
        tarea.prioridad = req.body.prioridad || tarea.prioridad
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
        try {
            const actualizado = await tarea.save()
            res.json(actualizado)
        } catch (error) {
            console.log(error)
        }
    }
};

const eliminarTarea = async (req, res) => {
    const tarea = await verificacionesTarea(req,res);
    
    if(!tarea.outputData){
        try {
            const proyecto = await Proyecto.findById(tarea.proyecto)
            proyecto.tareas.pull(tarea._id)
            // console.log('Proyecto:',proyecto);
            await Promise.allSettled([await proyecto.save(),await tarea.deleteOne()])
            
            res.json({msg:"La Tarea ha sido eliminada"})
        } catch (error) {
            console.log(error)
        }
    }
};

const cambiarTarea = async (req, res) => {

    const tarea = await verificacionesTarea(req,res,0);
    if(!tarea.outputData){
        tarea.estado =  !tarea.estado
        tarea.completado = req.usuario._id
        await tarea.save()

        const {id} = req.params
        const tareaAlmacenada = await Tarea.findById(id)
                                .populate("proyecto")
                                .populate("completado")
        res.json(tareaAlmacenada)
    }
};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarTarea
}