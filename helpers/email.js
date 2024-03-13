import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Confirma tu cuenta",
        text:"Comprueba tu cuenta en UpTask",
        html:`
            <p>Hola ${nombre} comprueba tu cueta en Uptask</p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Click aquí</a>
            </p>
            <p>Si no creaste esta cuenta, puedes ignorar este correo</p>
        `
    })
}

const emailCambioClave = async (datos) => {
    const {email, nombre, token} = datos

    // TODO: cambiarlo por variable de entorno
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Restablece tu clave",
        text:"Comprueba tu cuenta en UpTask",
        html:`
            <p>Hola ${nombre} has solicitado cambiar tu clave</p>
            <p>Sigue el siguiente enlace para generar una nueva clave:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Generar Nueva clave</a>
            </p>
            <p>Si no solicitaste este cambio de clave, puedes ignorar este correo</p>
        `
    })
}

export {
    emailRegistro,
    emailCambioClave,
    
}