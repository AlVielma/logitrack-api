import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// config del transporte de correo electrónico
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// verificar la conexión al servidor de correo electrónico
transporter.verify((error) => {
    if (error) {
        console.log(error);
    } else {    
        console.log('Servidor de correo listo para enviar mensajes');
    }
});

