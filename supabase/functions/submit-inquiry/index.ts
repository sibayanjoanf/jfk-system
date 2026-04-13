import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { firstName, lastName, email, phone, deliveryPreference, paymentPreference, message, items, totalAmount } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // ✅ Use .select() to get the generated order_number back
  const { data: inserted, error } = await supabase
    .from('inquiries')
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      delivery_preference: deliveryPreference,
      payment_preference: paymentPreference,
      message,
      items,
      total_amount: totalAmount,
    })
    .select('order_number')
    .single();

  const deliveryLabel: Record<string, string> = {
    "walk-in": "Walk-in",
    "delivery": "Delivery",
  };

  const paymentLabel: Record<string, string> = {
    "cash": "Cash",
    "online": "Online Payment",
  };

  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 500,
    headers: corsHeaders
  });

  const orderNumber = inserted.order_number;

  // ✅ QR code URL via free API — encodes the order number
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=10&data=${encodeURIComponent(orderNumber)}`;

  // ✅ Build item rows — uses item.image if available
  const itemRows = items.map((item: any) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e8e8; vertical-align: middle;">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" style="width:52px; height:52px; object-fit:cover; border-radius:6px; display:block;" />`
          : `<div style="width:52px;height:52px;background:#f5f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;">🪨</div>`
        }
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e8e8; vertical-align: middle; font-size: 14px; color: #333;">
        ${item.name}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e8e8; vertical-align: middle; font-size: 14px; color: #666; text-align: center;">
        x${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e8e8; vertical-align: middle; font-size: 14px; color: #e7000b; text-align: right; font-weight: 600;">
        ₱${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  // ✅ Full HTML email — inline styles only, Poppins via @import inside <style> tag (Gmail supports this!)
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; background-color: #f5f0f0; font-family: 'Poppins', Arial, sans-serif; }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0f0; padding: 32px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">

              <!-- Header -->
              <tr>
                <td style="background-color:#e7000b; padding: 32px 40px; text-align:center;">
                  <p style="margin:0; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.7); font-family:'Poppins',Arial,sans-serif;">Order Confirmation</p>
                  <h1 style="margin: 8px 0 0; font-size:26px; font-weight:700; color:#ffffff; font-family:'Poppins',Arial,sans-serif;">JFK Tile and Stone Builders</h1>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 36px 40px 0; font-family:'Poppins',Arial,sans-serif;">
                  <h2 style="margin:0 0 8px; font-size:20px; font-weight:600; color:#1a1a1a;">Hi ${firstName}! 👋</h2>
                  <p style="margin:0; font-size:14px; color:#666; line-height:1.7;">
                    Thanks for reaching out to us! We've received your order and will get back to you shortly.
                  </p>
                </td>
              </tr>

              <!-- Order ID + QR Code side by side -->
              <tr>
                <td style="padding: 28px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f6; border:1px solid #f0e0e0; border-radius:10px; overflow:hidden;">
                    <tr>
                      <!-- Order ID block -->
                      <td style="padding: 24px; vertical-align:middle; font-family:'Poppins',Arial,sans-serif;">
                        <p style="margin:0 0 4px; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#999;">Your Order ID</p>
                        <p style="margin:0; font-size:20px; font-weight:700; color:#e7000b; letter-spacing:1px;">${orderNumber}</p>
                        <p style="margin:12px 0 0; font-size:12px; color:#888; line-height:1.6;">
                          Use this ID or scan the QR code to track your order on our website.
                        </p>
                        <a href="https://jfktiles.me/order-qr?order_id=${orderNumber}" 
                          style="display:inline-block; margin-top:12px; padding:10px 20px; 
                                  background:#e7000b; color:#fff; border-radius:8px; 
                                  font-size:13px; font-weight:600; text-decoration:none; 
                                  font-family:'Poppins',Arial,sans-serif;">
                          View &amp; Download QR Code →
                        </a>
                      </td>
                      <!-- QR Code -->
                      <td style="padding: 20px 24px; text-align:center; vertical-align:middle; border-left:1px solid #f0e0e0;">
                        <img src="${qrCodeUrl}" alt="Order QR Code" width="120" height="120" style="display:block; border-radius:8px;" />
                        <p style="margin:8px 0 0; font-size:10px; color:#aaa; font-family:'Poppins',Arial,sans-serif;">Scan to track</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Order Summary -->
              <tr>
                <td style="padding: 0 40px 28px; font-family:'Poppins',Arial,sans-serif;">
                  <p style="margin:0 0 14px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; color:#999;">Order Summary</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e0e0; border-radius:10px; overflow:hidden;">
                    <thead>
                      <tr style="background:#fdf6f6;">
                        <th style="padding:10px 8px; font-size:11px; color:#999; text-align:left; font-weight:500; letter-spacing:1px; text-transform:uppercase;" colspan="2">Item</th>
                        <th style="padding:10px 8px; font-size:11px; color:#999; text-align:center; font-weight:500; letter-spacing:1px; text-transform:uppercase;">Qty</th>
                        <th style="padding:10px 8px; font-size:11px; color:#999; text-align:right; font-weight:500; letter-spacing:1px; text-transform:uppercase;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemRows}
                    </tbody>
                    <tfoot>
                      <tr style="background:#fdf6f6;">
                        <td colspan="3" style="padding:14px 8px; font-size:14px; font-weight:600; color:#333; text-align:right; font-family:'Poppins',Arial,sans-serif;">Total</td>
                        <td style="padding:14px 8px; font-size:16px; font-weight:700; color:#e7000b; text-align:right; font-family:'Poppins',Arial,sans-serif;">₱${totalAmount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>

              <!-- Contact Info -->
              <tr>
                <td style="padding: 0 40px 28px; font-family:'Poppins',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f6; border:1px solid #f0e0e0; border-radius:10px; padding:20px;">
                    <tr>
                      <td style="padding:16px 20px; font-size:13px; color:#555; line-height:1.8; font-family:'Poppins',Arial,sans-serif;">
                        📦 <strong>Delivery Preference:</strong> ${deliveryLabel[deliveryPreference]}<br/>
                        💳 <strong>Payment Method:</strong> ${paymentLabel[paymentPreference]}<br/>
                        📧 We'll follow up at <strong>${email}</strong> or <strong>${phone}</strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#1a1a1a; padding:24px 40px; text-align:center; font-family:'Poppins',Arial,sans-serif;">
                  <p style="margin:6px 0 0; font-size:12px; color:#555;">— JFK Tile and Stone Builders 🪨</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'JFK Tile and Stone Builders <noreply@jfktiles.me>',
      to: email,
      subject: `Order Confirmed — ${orderNumber} 🧱`,
      html: emailHtml,   // ✅ html instead of text
    }),
  });

  return new Response(JSON.stringify({ success: true, order_number: orderNumber }), {
    status: 200,
    headers: corsHeaders
  });
});