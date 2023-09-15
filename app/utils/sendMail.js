const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mikossyakadyr@gmail.com',
      pass: 'ykcuhuykdnsjjvwm'
    }
  });
  function sendEmail(to, subject, text){
    const mailOptions = {
      from: 'mikossyakadyr@gmail.com',
      to: to,
      subject: subject,
      text: text
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        // res.status(500).send('Failed to send email.');
      } else {
        console.log('Email sent:', + info.response);
        // res.status(200).send('Email sent successfully.');
      }
    });
  };

module.exports = sendEmail;
  