import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma blog" <prismablog@gmail.com>',
          to: user.email,
          subject: "Please verify your E-mail",
          html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="padding:24px; text-align:center; background:#111827; color:#ffffff; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:22px;">Prisma Blog</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px; color:#333333;">
                <h2 style="margin-top:0;">Verify your email address</h2>

                <p style="font-size:15px; line-height:1.6;">
                  Thank you for creating an account with <strong>Prisma Blog</strong>.
                  Please verify your email address to complete your registration.
                </p>

                <div style="text-align:center; margin:30px 0;">
                  <a
                    href="${verificationUrl}"
                    style="background:#2563eb; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:15px; display:inline-block;"
                  >
                    Verify Email
                  </a>
                </div>

                <p style="font-size:14px; color:#555;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="font-size:13px; word-break:break-all; color:#2563eb;">
                  ${verificationUrl}
                </p>

                <p style="font-size:14px; color:#555;">
                  If you did not create this account, please ignore this email.
                </p>

                <p style="margin-top:30px; font-size:14px;">
                  Regards,<br />
                  <strong>Prisma Blog Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px; text-align:center; background:#f9fafb; font-size:12px; color:#777; border-radius:0 0 8px 8px;">
                © 2026 Prisma Blog. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

        `,
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
});
