import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const { SENDGRID_API_KEY, FROM_EMAIL } = process.env;

if (!SENDGRID_API_KEY) {
  console.warn(
    "SENDGRID_API_KEY is not set. Emails will not be sent until it is configured."
  );
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendEmail({ to, subject, text, html }) {
  if (!SENDGRID_API_KEY) {
    return;
  }

  try {
    await sgMail.send({
      to,
      from: FROM_EMAIL || "no-reply@example.com",
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
  }
}

