// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
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

  // save to DB
  const { error } = await supabase.from('inquiries').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    delivery_preference: deliveryPreference,
    payment_preference: paymentPreference,
    message,
    items,
    total_amount: totalAmount,
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), { 
    status: 500,
    headers: corsHeaders 
  });

  // send confirmation email via Resend
  const emailBody = `
Hi ${firstName}!

Thanks for reaching out to JFK Tile and Stone Builders. 
We've received your contact and will get back to you shortly!

Here's what you ordered:

${items.map((item: any) => `- ${item.name} x${item.quantity} — ₱${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total: ₱${totalAmount.toLocaleString()}

We'll contact you via ${email} or ${phone}.

— JFK Tile and Stone Builders 🪨
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
      subject: 'We received your inquiry! 🧱',
      text: emailBody,
    }),
  });

  return new Response(JSON.stringify({ success: true }), { 
    status: 200,
    headers: corsHeaders 
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/submit-inquiry' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
