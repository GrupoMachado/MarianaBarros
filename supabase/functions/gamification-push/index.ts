import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set your OneSignal App ID and REST API Key in edge function secrets:
// supabase secrets set ONESIGNAL_APP_ID="your-app-id" ONESIGNAL_REST_KEY="your-rest-key"
const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID") || "app-id-placeholder";
const ONESIGNAL_REST_KEY = Deno.env.get("ONESIGNAL_REST_KEY") || "rest-key-placeholder";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendOneSignalPush(userId: string, headings: string, contents: string) {
  const reqBody = {
    app_id: ONESIGNAL_APP_ID,
    include_external_user_ids: [userId],
    headings: { en: headings, pt: headings },
    contents: { en: contents, pt: contents },
  };

  const response = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${ONESIGNAL_REST_KEY}`
    },
    body: JSON.stringify(reqBody)
  });

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { target_user_id, trigger_type, current_xp, next_level_xp } = await req.json();

    if (trigger_type === 'streak_reminder') {
      // Logic for streak normally runs via a pg_cron that checks activity.
      // E.g: "Não deixes quebrar a tua streak de 5 dias! Treina agora."
      await sendOneSignalPush(target_user_id, "🔥 Cuidado com a Streak!", "Não deixes quebrar a tua streak! A consistência é tudo. Treina agora.");
    }
    else if (trigger_type === 'xp_target') {
      // Triggered when XP changes drastically
      if (next_level_xp && current_xp) {
        const diff = next_level_xp - current_xp;
        if (diff > 0 && diff <= 100) {
          await sendOneSignalPush(target_user_id, "🏆 Quase lá!", `Faltam só ${diff} XP para o próximo Nível! Bora bater essa meta?`);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Push sent or analyzed successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
