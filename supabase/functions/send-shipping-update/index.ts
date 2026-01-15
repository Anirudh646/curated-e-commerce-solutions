import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShippingUpdateRequest {
  email: string;
  customerName: string;
  orderId: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'processing':
      return { title: 'Order Processing', emoji: '📦', message: 'We are preparing your order for shipment.' };
    case 'shipped':
      return { title: 'Order Shipped', emoji: '🚚', message: 'Your order is on its way!' };
    case 'out_for_delivery':
      return { title: 'Out for Delivery', emoji: '📍', message: 'Your order will be delivered today!' };
    case 'delivered':
      return { title: 'Order Delivered', emoji: '✅', message: 'Your order has been delivered successfully!' };
    default:
      return { title: 'Order Update', emoji: '📋', message: 'There is an update to your order.' };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, customerName, orderId, status, trackingNumber, estimatedDelivery }: ShippingUpdateRequest = await req.json();
    
    const statusInfo = getStatusMessage(status);

    const emailResponse = await resend.emails.send({
      from: "Store <onboarding@resend.dev>",
      to: [email],
      subject: `${statusInfo.emoji} ${statusInfo.title} - Order #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">${statusInfo.emoji} ${statusInfo.title}</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px;">Hello ${customerName},</p>
            <p>${statusInfo.message}</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #667eea;">Order #${orderId.slice(0, 8).toUpperCase()}</h2>
              
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                  <td style="padding: 8px 0; font-weight: bold; text-transform: capitalize;">${status.replace(/_/g, ' ')}</td>
                </tr>
                ${trackingNumber ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Tracking Number:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${trackingNumber}</td>
                </tr>
                ` : ''}
                ${estimatedDelivery ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Estimated Delivery:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${estimatedDelivery}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <p style="margin-bottom: 0;">Thank you for shopping with us!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p>If you have any questions, just reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Shipping update email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending shipping update:", error);
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
