import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";

export const sendOtp = async (email) => {
  try {
    // Create transporter dynamically when the function is called
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: process.env.GMAIL_USER || "abhishekpathak37733@gmail.com",
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    // 1. Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Upsert in MongoDB
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        otp: generatedOtp,
        createdAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // 3. Send email using Nodemailer
    const mailOptions = {
      from: '"Storage App" <abhishekpathak37733@gmail.com>',
      to: email,
      subject: "Your Email Verification OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Verify Your Email</h2>
          <p>Use the following OTP code to verify your email address. This code is valid for <strong>5 minutes</strong>:</p>
          <div style="background: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">
            ${generatedOtp}
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
            If you did not request this verification, please ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent: %s", info.messageId);

    return true;
  } catch (error) {
    console.error("Error in sendOtp utility:", error);
    throw error;
  }
};
