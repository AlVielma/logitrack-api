export const getOtpEmailTemplate = (otp: string, userName: string = 'Usuario') => {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación - Logitrack</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #000000;
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        letter-spacing: 1px;
      }
      .content {
        padding: 40px 30px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
        color: #555555;
        margin-bottom: 25px;
      }
      .otp-container {
        background-color: #f9f9f9;
        border: 2px dashed #000000;
        border-radius: 6px;
        padding: 20px;
        margin: 30px auto;
        max-width: 300px;
      }
      .otp-code {
        font-size: 36px;
        font-weight: bold;
        color: #000000;
        letter-spacing: 5px;
        margin: 0;
      }
      .footer {
        background-color: #000000;
        color: #ffffff;
        text-align: center;
        padding: 15px;
        font-size: 12px;
      }
      .footer p {
        margin: 5px 0;
        color: #aaaaaa;
      }
      .warning {
        font-size: 14px;
        color: #888888;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>LOGITRACK</h1>
      </div>
      <div class="content">
        <p>Hola, <strong>${userName}</strong>,</p>
        <p>Has solicitado iniciar sesión en Logitrack. Por favor, utiliza el siguiente código de verificación para completar tu acceso.</p>
        
        <div class="otp-container">
          <p class="otp-code">${otp}</p>
        </div>
        
        <p>Este código expira en <strong>10 minutos</strong>.</p>
        
        <p class="warning">Si no solicitaste este código, por favor ignora este correo. Nadie puede acceder a tu cuenta sin él.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Logitrack. Todos los derechos reservados.</p>
        <p>Este es un correo generado automáticamente, no respondas a este mensaje.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
