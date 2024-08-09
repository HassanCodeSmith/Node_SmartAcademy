import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `${process.env.FROM} <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw { errorCode: 500, fullError: error, errorMessage: error.message };
  }
};
