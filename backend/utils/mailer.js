const nodemailer = require('nodemailer');

// Buat transporter sekali, reuse untuk semua email
const transporter = nodemailer.createTransport({
  service: 'gmail', // ganti ke 'outlook', 'yahoo', dll sesuai provider
  auth: {
    user: process.env.MAIL_USER, // email pengirim
    pass: process.env.MAIL_PASS, // app password (bukan password akun biasa)
  },
});

/**
 * Kirim email
 * @param {string} to      - alamat penerima
 * @param {string} subject - subject email
 * @param {string} html    - isi email dalam format HTML
 */
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Inventory System" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
