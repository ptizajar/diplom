const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Инициализация транспортера
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "maksmebel0@gmail.com",
        pass: "qjdw wutc ogjh nfkf",
      },
    });

    this.adminEmail = "maksmebel0@gmail.com";
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

async sendNewOrderNotification(orderData) {
  const mailOptions = {
    from: `МАКС-МЕБЕЛЬ`,
    to: this.adminEmail,
    subject: `Новый заказ №${orderData.order_id}`,
    text: `Поступил новый заказ №${orderData.order_id} в ${new Date(orderData.created_at).toLocaleString('ru-RU')}`,
  };

  await this.transporter.sendMail(mailOptions);
}
}

// Создаем и экспортируем один экземпляр сервиса
export const emailService = new EmailService();

//emailService.sendVerificationCode("ptizajar@gmail.com");
