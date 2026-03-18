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

  const { inquiryId, firstName, email, message, reply, createdAt } = await req.json();

  // mark as Resolved in DB
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error } = await supabase
    .from('contact')
    .update({ status: 'Resolved' })
    .eq('id', inquiryId);

  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 500,
    headers: corsHeaders
  });

  // format the date nicely
  const formattedDate = new Date(createdAt).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const emailBody = `
Hello ${firstName}! We received your message on ${formattedDate}.

You said:
${message}

Our reply is:
${reply}

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
      subject: `Re: Your inquiry - JFK Tile and Stone Builders`,
      text: emailBody,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders
  });
});