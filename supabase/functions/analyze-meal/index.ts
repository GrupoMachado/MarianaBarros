import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const body = await req.json()
    const imageBase64 = body.image;
    const textInput = body.textInput; // Opcional: texto escrito pelo utilizador
    
    if (!imageBase64 && !textInput) throw new Error("Nenhuma imagem ou texto fornecido.");

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY em falta.");

    // Constrói o Prompt dinamicamente
    let basePrompt = "És um nutricionista desportivo. Estima as calorias e macros. Responde APENAS com um JSON estrito com esta estrutura: {\"mealName\": \"nome\", \"calories\": numero, \"protein\": numero, \"carbs\": numero, \"fat\": numero, \"description\": \"descriçao\"}";
    
    if (textInput) {
        basePrompt += `\nO utilizador descreveu a refeição da seguinte forma: "${textInput}". Baseia os teus cálculos EXATAMENTE nas quantidades e ingredientes descritos.`;
    }

    const parts = [{ text: basePrompt }];

    // Se houver imagem, adiciona à análise
    if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.error("Erro Google:", errBody);
        throw new Error("Falha na API da Google");
    }

    const data = await response.json();
    const textResult = data.candidates[0].content.parts[0].text;
    
    return new Response(textResult, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("🚨 Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
