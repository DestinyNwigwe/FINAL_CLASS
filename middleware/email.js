const nodemailer = require("nodemailer");

exports.sendMail = async ({to, subject, text,html}) => {
    try{
        const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
service: "gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.email,
    pass:process.env.pass,
  }
});
     const info = await transporter.sendMail({
    from:process.env.user,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html
  });
  console.log("message sent: %s", info.messageId);
   return info;
    } catch(error) {
        console.log("Error sending email:", error);
        throw error
    }

}


  

