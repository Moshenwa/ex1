const nodemailer = require('nodemailer')

const sendEmail = async(options)=>{
    const transport = nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASSWORD 
         
        }
      });

  /*     const gmailTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "alexy@hermelin.ort.org.il",
            pass: "******"
        }
       }); 
 */
 const mailOptions = {
    from:  'Cats World <cat@email.com>',
    to : options.emailTo,
    subject: options.subject,
    text : options.text
 }


await transport.sendMail(mailOptions);
// await gmailTransport.sendMail(mailOptions)




}
module.exports = sendEmail;