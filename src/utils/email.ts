import { transporter } from "../configs/mailer";
import { getOtpEmailTemplate } from "../templates/otpEmailTemplate";

export const sendOTP = async (email: string, otp: string, userName?: string) => {
  const mailOptions = {
    from: `"Logitrack API" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Código de Verificación - Logitrack",
    text: `Tu código de verificación es: ${otp}\n\nSi no solicitaste este código, puedes ignorar este correo.`,
    html: getOtpEmailTemplate(otp, userName),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a: ${email} [MessageID: ${info.messageId}]`);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo: ", error);
    throw new Error("No se pudo enviar el correo de verificación");
  }
};