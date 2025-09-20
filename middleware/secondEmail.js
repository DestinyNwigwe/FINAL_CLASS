const sgMail = require('destinynwaigwe322@gmail.com/mail');
sgMail.setApiKey('kubw tutb dejp rpio');

const msg = {
 from:process.env.user,
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html: options.html
  html: '<strong>This is a test email sent using SendGrid</strong>',
};

sgMail
  .send(msg)
  .then(() => console.log('Email sent successfully'))
  .catch((error) => console.error(error));
