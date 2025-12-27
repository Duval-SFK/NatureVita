import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email
 */
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'NatureVita'}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5016; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2d5016; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NatureVita</h1>
        </div>
        <div class="content">
          <h2>Bienvenue ${user.name}!</h2>
          <p>Merci de vous être inscrit sur NatureVita. Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <a href="${verificationUrl}" class="button">Vérifier mon email</a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p>${verificationUrl}</p>
          <p>Ce lien expirera dans 24 heures.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NatureVita. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(user.email, 'Vérifiez votre adresse email - NatureVita', html);
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (user, order, orderItems, language = 'fr') => {
  const translations = {
    fr: {
      subject: 'Confirmation de commande - NatureVita',
      title: 'Votre commande a été confirmée',
      orderNumber: 'Numéro de commande',
      total: 'Total',
      paymentMethod: 'Méthode de paiement',
      items: 'Articles',
      quantity: 'Quantité',
      price: 'Prix',
      subtotal: 'Sous-total',
      thankYou: 'Merci pour votre commande!',
      footer: 'Nous vous contacterons bientôt pour le suivi de votre commande.'
    },
    en: {
      subject: 'Order Confirmation - NatureVita',
      title: 'Your order has been confirmed',
      orderNumber: 'Order number',
      total: 'Total',
      paymentMethod: 'Payment method',
      items: 'Items',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      thankYou: 'Thank you for your order!',
      footer: 'We will contact you soon regarding your order tracking.'
    }
  };

  const t = translations[language] || translations.fr;

  const itemsHtml = orderItems.map(item => `
    <tr>
      <td>${item.productName}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()} FCFA</td>
      <td>${item.subtotal.toLocaleString()} FCFA</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5016; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #2d5016; color: white; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NatureVita</h1>
        </div>
        <div class="content">
          <h2>${t.title}</h2>
          <p><strong>${t.orderNumber}:</strong> ${order.orderNumber}</p>
          <p><strong>${t.paymentMethod}:</strong> ${order.paymentMethod || 'N/A'}</p>
          
          <h3>${t.items}</h3>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>${t.quantity}</th>
                <th>${t.price}</th>
                <th>${t.subtotal}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            <strong>${t.total}: ${order.totalAmount.toLocaleString()} FCFA</strong>
          </div>
          
          <p>${t.thankYou}</p>
          <p>${t.footer}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NatureVita. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(user.email, t.subject, html);
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2d5016; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2d5016; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NatureVita</h1>
        </div>
        <div class="content">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.name},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
          <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p>${resetUrl}</p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NatureVita. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(user.email, 'Réinitialisation de mot de passe - NatureVita', html);
};

