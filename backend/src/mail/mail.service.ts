import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendMail(to: string, orderId: string) {
    const subject = `Xác nhận thanh toán đơn hàng #${orderId}`;
    const html = `<p>Xin chào,</p>
                  <p>Đơn hàng #${orderId} của bạn đã được thanh toán thành công.</p>
                  <p>Cảm ơn bạn đã mua hàng!</p>`;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`Failed to send email to ${to}`, error);
    }
  }
}
