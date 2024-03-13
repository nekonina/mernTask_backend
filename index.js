import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import conectarDB from "./config/db.js";
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/TareaRoutes.js'
import { Server } from "socket.io";

const app  = express()
app.use(express.json())
dotenv.config();

conectarDB();

//configurar CORS
const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin,  callback){
        if(whiteList.includes(origin)){
            //Puede consultar la API
            callback(null, true)
        }else{
            //No esta permitido
            callback(new Error("Error de CORS"))
        }
    }
}

app.use(cors(corsOptions));

app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareaRoutes)

const PORT = process.env.PORT || 4000;

const serverApp = app.listen(PORT, ()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`) 
})

// socket.io
const io = new Server(serverApp, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {
    console.log('Conectado a socket.io')
    //Aqui lod eventos a ejecutar de socket.io
    socket.on('abrir proy', (proyecto) => {
        socket.join(proyecto);
    })

    socket.on('nueva tarea', (tarea) => {
       const {proyecto} = tarea
       socket.to(proyecto).emit('tarea agregada', tarea);
    })

    socket.on('eliminar tarea', (tarea) => {
        const {proyecto} = tarea
        socket.to(proyecto).emit('tarea eliminada',tarea);
    })

    socket.on('editar tarea', (tarea) => {
        const {proyecto} = tarea
        socket.to(proyecto._id).emit('tarea editada',tarea);
    })

    socket.on('cambiar estatus tarea', (tarea) => {
        console.log(tarea)
        const {proyecto} = tarea
        socket.to(proyecto._id).emit('estatus tarea editado',tarea);
    })
})