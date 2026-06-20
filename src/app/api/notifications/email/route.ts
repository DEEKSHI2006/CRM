import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "../../../../lib/auth";

const bodySchema = z.object({
  to: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = bodySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid email payload." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const from = process.env.SMTP_FROM ?? "CRM Analytics <noreply@example.com>";

  if (!host) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      preview: {
        from,
        to: payload.data.to,
        subject: payload.data.subject,
        message: payload.data.message
      }
    });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS ?? ""
        }
      : undefined
  });

  await transporter.sendMail({
    from,
    to: payload.data.to,
    subject: payload.data.subject,
    text: `${payload.data.message}\n\nSent from Northstar CRM by ${user.name}`
  });

  return NextResponse.json({ ok: true, mode: "sent" });
}