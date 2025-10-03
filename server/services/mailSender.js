import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import fs from 'fs';
import inlineCss from 'inline-css';

const mailSender = async (email, otp, otp_type) => {
  const transporter = await nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  // logger: true,
  // debug: true
});

  let htmlContent = fs.readFileSync('otp_template.html', 'utf-8');
  htmlContent = htmlContent.replace('tradevault_otp', otp);
  htmlContent = htmlContent.replace('tradevault_otp2', otp_type);

  const options = { url: ' ' };

  htmlContent = await inlineCss(htmlContent, options);

  try {
    let result = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Trading App - OTP Verification',
      html: htmlContent,
    });

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  return otp;
};

export default mailSender;