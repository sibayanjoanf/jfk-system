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

  const { firstName, lastName, email, phone, message } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error } = await supabase.from('contact').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    message
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 500,
    headers: corsHeaders
  });

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
              <p style="margin:0; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.7); font-family:'Poppins',Arial,sans-serif;">Message Received</p>
              <h1 style="margin: 8px 0 0; font-size:26px; font-weight:700; color:#ffffff; font-family:'Poppins',Arial,sans-serif;">JFK Tile and Stone Builders</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 36px 40px 0; font-family:'Poppins',Arial,sans-serif;">
              <h2 style="margin:0 0 8px; font-size:20px; font-weight:600; color:#1a1a1a;">Hi ${firstName}! 👋</h2>
              <p style="margin:0; font-size:14px; color:#666; line-height:1.7;">
                Thanks for reaching out! We've received your message and will get back to you as soon as possible.
              </p>
            </td>
          </tr>

          <!-- Message recap -->
          <tr>
            <td style="padding: 28px 40px; font-family:'Poppins',Arial,sans-serif;">
              <p style="margin:0 0 14px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; color:#999;">Your Message</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f6; border:1px solid #f0e0e0; border-radius:10px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin:0; font-size:14px; color:#444; line-height:1.8; font-family:'Poppins',Arial,sans-serif; white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact info -->
          <tr>
            <td style="padding: 0 40px 32px; font-family:'Poppins',Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f6; border:1px solid #f0e0e0; border-radius:10px;">
                <tr>
                  <td style="padding: 16px 20px; font-size:13px; color:#555; line-height:1.8; font-family:'Poppins',Arial,sans-serif;">
                    📧 We'll follow up at <strong>${email}</strong><br/>
                    📞 Or reach you at <strong>${phone}</strong>
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
      subject: `We received your message, ${firstName}! 📧`,
      html: emailHtml,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders
  });
});