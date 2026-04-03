import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, text }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // 🔒 Port 465 requires secure: true
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASS // 🔑 Must be a 16-character App Password!
        },
        tls: {
            // 🚀 THE RENDER FIX: Allows connection from cloud environments
            rejectUnauthorized: false 
        }
    });

    const mailOptions = {
        from: `Unravel Team <${process.env.GOOGLE_USER}>`,
        to,
        subject,
        html,
        text
    };

    try {
        const details = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", details.messageId);
        return details;
    } catch (error) {
        // This will now show the SPECIFIC error in Render logs
        console.error("❌ Email failed:", error.message);
        throw error;
    }
}