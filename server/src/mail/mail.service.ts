import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: (process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendPasswordResetCode(
    recipientEmail: string,
    resetCode: string,
  ): Promise<void> {
    const fromName = process.env.MAIL_FROM_NAME ?? 'W-Note';
    const fromAddress =
      process.env.MAIL_FROM_ADDRESS ??
      process.env.SMTP_USER ??
      'wnoteapp@gmail.com';
    const escapedCode = this.escapeHtml(resetCode);

    await this.transporter.sendMail({
      from: `"${this.escapeHeader(fromName)}" <${fromAddress}>`,
      to: recipientEmail,
      subject: 'Codice per il recupero della password W-Note',
      text:
        `Il tuo codice per il recupero della password W-Note è: ${resetCode}\n\n` +
        'Il codice scade dopo 15 minuti. Se non hai richiesto tu il recupero, ignora questa email.',
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">Recupero password W-Note</h2>
          <p>Usa questo codice per impostare una nuova password:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 18px 0; color: #86B749;">
            ${escapedCode}
          </p>
          <p>Il codice scade dopo <strong>15 minuti</strong>.</p>
          <p style="color: #64748b;">Se non hai richiesto tu il recupero, ignora questa email.</p>
        </div>
      `,
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private escapeHeader(value: string): string {
    return value.replace(/["\r\n]/g, '');
  }
}
