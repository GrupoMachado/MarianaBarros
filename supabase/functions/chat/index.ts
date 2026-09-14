import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS options request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, coachName, coachDescription, imageBase64 } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Chave de API não configurada' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const systemPrompt = `Você é ${coachName || 'Nutricionista de IA'}, um treinador pessoal de IA. ${coachDescription || ''} Responda de forma concisa, motivadora, usando a sua persona. Fale em português de Portugal ou Brasil, de forma natural.`;

    const userParts: any[] = [{ text: message }];
    if (imageBase64) {
      const mimeType = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      userParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    const MODELS = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    let reply = null;

    for (const model of MODELS) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: userParts }]
          })
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
          reply = data.candidates[0].content.parts[0].text;
          break;
        }
      } catch (err) {
        console.error(`Falha no modelo ${model}:`, err);
      }
    }

    if (reply) {
      return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ reply: 'Desculpe, os servidores da IA estão ocupados. Tente de novo em segundos! 🤖' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    
  } catch (error) {
    console.error('Erro geral:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
