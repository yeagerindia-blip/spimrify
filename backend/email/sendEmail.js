import { Resend } from 'resend';
import dotenv from "dotenv"
dotenv.config()
// Ye variable Render se key uthayega
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPByEmail = async (email, otp) => {
    try {
        console.log("Resend API se OTP bhej raha hoon...");
        
        const { data, error } = await resend.emails.send({
            from: 'OTP <otp@spimrify.co.in>', // Free tier mein yahi rahega
            to: email, 
            subject: 'Spimrify - Your OTP Code',
            html: `<strong>Your OTP is: ${otp}</strong>. It will expire in 10 minutes.`,
        });

        if (error) {
            console.error("Resend Error:", error);
            return false;
        }

        console.log("Success! Email sent:", data.id);
        return true;
    } catch (err) {
        console.error("Critical Resend Error:", err.message);
        return false;
    }
};