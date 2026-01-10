import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationRequest {
  email: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  currency?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, customerName, orderId, items, total, currency = 'INR' }: OrderConfirmationRequest = await req.json();

    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    };

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "Store <onboarding@resend.dev>",
      to: [email],
      subject: `Order Confirmation - #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Order Confirmed! 🎉</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px;">Hello ${customerName},</p>
            <p>Thank you for your order! We're excited to let you know that we've received your order and it's being processed.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #667eea;">Order #${orderId.slice(0, 8).toUpperCase()}</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px; text-align: left;">Item</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 12px; font-weight: bold;">Total</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">${formatPrice(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <p style="margin-bottom: 0;">We'll send you another email when your order ships.</p>
            <p>Thank you for shopping with us!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p>If you have any questions, just reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
