'use server'

import { Resend } from 'resend';
import prisma from '@/lib/prisma';

/** Read the admin-configured contact email from store-settings, fall back to default. */
async function getStoreContactEmail(): Promise<string> {
  try {
    const row = await prisma.pageContent.findUnique({ where: { id: 'store-settings' } });
    if (row?.content) {
      const s = JSON.parse(row.content);
      if (typeof s.contactEmail === 'string' && s.contactEmail.trim()) {
        return s.contactEmail.trim();
      }
    }
  } catch { /* fall through */ }
  return 'kanika.wildlifewonder9@gmail.com';
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerPincode: string;
  items: Array<{ name: string; price: number; quantity: number; category: string }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  discount?: number;
}

export async function sendContactSubmissionEmail(data: ContactEmailData) {
  const apiKey = process.env.RESEND_API_KEY || 're_xxxxxxxxx';
  const resend = new Resend(apiKey);

  try {
    if (apiKey === 're_xxxxxxxxx') {
      console.warn("Resend API key is not configured. Email simulation (logged to console):");
      console.log(`[Contact Email Mock] Name: ${data.name}, Email: ${data.email}, Subject: ${data.subject}, Message: ${data.message}`);
      return { success: true };
    }

    const toEmail = await getStoreContactEmail();
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject: `New Contact Submission: ${data.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #071D16; border-bottom: 2px solid #D6B87A; padding-bottom: 10px;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <div style="background-color: #f7f1e5; padding: 15px; border-radius: 6px; margin-top: 15px; white-space: pre-wrap;">
            <strong>Message:</strong><br/>
            ${data.message}
          </div>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, error: 'Failed to send message email' };
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY || 're_xxxxxxxxx';
  const resend = new Resend(apiKey);

  try {
    if (apiKey === 're_xxxxxxxxx') {
      console.warn("Resend API key is not configured. Email simulation (logged to console):");
      console.log(`[Order Email Mock] Customer: ${data.customerName}, Email: ${data.customerEmail}, Total: ₹${data.total}`);
      return { success: true };
    }

    const itemsHtml = data.items
      .map(item => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0;">${item.name} (${item.category})</td>
          <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `)
      .join('');

    const toEmail = await getStoreContactEmail();
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject: `New Order Placed - Total ₹${data.total.toLocaleString('en-IN')}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #071D16; border-bottom: 2px solid #D6B87A; padding-bottom: 10px;">New Order Notification</h2>
          
          <h3 style="color: #102C22; margin-top: 20px;">Customer Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.customerName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
          <p style="margin: 5px 0;">
            <strong>Shipping Address:</strong><br/>
            ${data.customerAddress},<br/>
            ${data.customerCity}, ${data.customerState} - ${data.customerPincode}<br/>
            India
          </p>

          <h3 style="color: #102C22; margin-top: 25px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #eee; font-weight: bold;">
                <td style="padding: 5px 0;">Item</td>
                <td style="padding: 5px 0; text-align: center;">Qty</td>
                <td style="padding: 5px 0; text-align: right;">Price</td>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 15px; text-align: right; line-height: 1.6;">
            <p style="margin: 5px 0;">Subtotal: ₹${data.subtotal.toLocaleString('en-IN')}</p>
            ${data.discount ? `<p style="margin: 5px 0; color: #b91c1c;">Discount: -₹${data.discount.toLocaleString('en-IN')}</p>` : ''}
            <p style="margin: 5px 0;">Shipping Fee: ${data.shippingFee === 0 ? 'FREE' : `₹${data.shippingFee.toLocaleString('en-IN')}`}</p>
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #D6B87A;">Total Amount: ₹${data.total.toLocaleString('en-IN')}</p>
          </div>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send order email:', error);
    return { success: false, error: 'Failed to send order confirmation email' };
  }
}
