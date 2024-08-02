const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Servidor de correo listo para enviar mensajes');
    }
});

const sendConfirmationEmail = (to, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: 'Confirmación de cuenta',
        html: `<p>Haga clic en el siguiente enlace para activar su cuenta:</p>
               <a href="${process.env.BASE_URL}/api/users/confirm/${token}">Activar Cuenta</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

const sendResetPasswordEmail = (to, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: 'Restablecimiento de Contraseña',
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
               <a href="${process.env.BASE_URL_FRONT}/reset-password/${token}">Restablecer Contraseña</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

module.exports = {
    sendConfirmationEmail,
    sendResetPasswordEmail
};
