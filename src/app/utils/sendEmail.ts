import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.Node_Env === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'abdullahnoman4537@gmail.com',
      pass: 'wjtu cgqh juhj gsdt',
    },
  });
  await transporter.sendMail({
    from: 'abdullahnoman4537@gmail.com', // sender address
    to: `${to}`, // list of receivers
    subject: 'Hello ✔ Password Change ', // Subject line
    text: 'Hello world? PassWord Vule Geco', // plain text body
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Password Change</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 15px;
            font-size: 16px;
            text-decoration: none;
            color: #fff;
            background-color: #007bff;
            border-radius: 4px;
          }
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Dear User,</p>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <p><a class="btn" href=${resetLink}>Reset Password</a></p>
          <p>If you didn't request a password reset, you can ignore this email.</p>
          <p>Thank you!</p>
        </div>
      </body>
      </html>
    `, // html body
  });

  // console.log('Message sent: %s', info.messageId);
};
