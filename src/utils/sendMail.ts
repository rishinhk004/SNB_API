import nodemailer, { Transporter } from "nodemailer";
import { courseRegistrationEmail, classCancellationEmail } from "./html";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

class EmailService {
  private primaryTransporter: Transporter;
  private fallbackTransporter: Transporter;

  constructor() {
    // Primary Gmail SMTP
    this.primaryTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.PRIMARY_EMAIL,
        pass: process.env.PRIMARY_EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    // Fallback Gmail SMTP
    this.fallbackTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SECONDARY_EMAIL, // fixed typo
        pass: process.env.SECONDARY_EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.primaryTransporter.sendMail(options);
      console.log("Email sent to", options.to);
    } catch (primaryError) {
      console.error("Primary SMTP failed:", primaryError);
      try {
        await this.fallbackTransporter.sendMail(options);
        console.log("Email sent via fallback SMTP to", options.to);
      } catch (fallbackError) {
        console.error("Fallback SMTP failed:", fallbackError);
        throw new Error("Both primary and fallback email sending failed.");
      }
    }
  }
}

const emailService = new EmailService();

export const sendCourseRegistrationEmail = async (
  email: string,
  student: { name: string; rollNo?: string },
  course: {
    name: string;
    code?: string;
    description?: string;
    professorName?: string;
    semester?: number;
    year?: number;
  }
) => {
  const { subject, html, text } = courseRegistrationEmail(student, course);
  await emailService.sendEmail({ to: email, subject, text, html });
};

export const sendClassCancellationEmail = async (
  email: string,
  student: { name: string; rollNo?: string },
  course: { name: string; code?: string },
  session: { date: Date; location?: string; reason?: string }
) => {
  const { subject, html, text } = classCancellationEmail(
    student,
    course,
    session
  );
  await emailService.sendEmail({ to: email, subject, text, html });
};

export default emailService.sendEmail;
