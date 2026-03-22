import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, text }) {
    // Creating the transporter inside the function ensures process.env is ready
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASS 
        }
    });

    const mailOptions = {
        from: `Perplexity Team <${process.env.GOOGLE_USER}>`,
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
        console.error("❌ Email failed:", error.message);
        throw error;
    }
}