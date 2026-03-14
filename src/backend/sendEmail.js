const nodemailer = require("nodemailer");


class EmailService {
  constructor() {
         // Инициализация транспортера
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER || 'maksmebel0@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD || 'qjdw wutc ogjh nfkf',
          },
        });
  }
  // Отправка кода
  async sendVerificationCode(userEmail, code) {
     // Формируем письмо
      const mailOptions = {
        from: `МАКС-МЕБЕЛЬ`,
        to: userEmail,
        subject: "Код подтверждения",
        html: `
          <h2>Подтверждение email</h2>
          <p>Ваш код подтверждения: <strong>${code}</strong></p>
          <p>Код действителен 10 минут</p>
        `,
      };

      // Отправляем
       await this.transporter.sendMail(mailOptions); 
  }
}

// Создаем и экспортируем один экземпляр сервиса
export const emailService = new EmailService();

//emailService.sendVerificationCode("ptizajar@gmail.com");

