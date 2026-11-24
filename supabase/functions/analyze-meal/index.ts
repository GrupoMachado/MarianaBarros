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
    let basePrompt = "És um nutricionista desportivo. Estima as calorias e macros (números inteiros). Responde APENAS com um JSON estrito com esta estrutura: {\"mealName\": \"nome\", \"calories\": numero, \"protein\": numero, \"carbs\": numero, \"fat\": numero, \"description\": \"descriçao\"}";
    
    if (textInput) {
        basePrompt += `\nO utilizador descreveu a refeição da seguinte forma: "${textInput}". Baseia os teus cálculos EXATAMENTE nas quantidades e ingredientes descritos.`;
    }

    const parts: Array<Record<string, unknown>> = [{ text: basePrompt }];

    // Se houver imagem, adiciona à análise
    if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({ inlineData: { mimeType: body.mimeType || "image/jpeg", data: cleanBase64 } });
    }

    const requestPayload = JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { responseMimeType: "application/json" }
    });

    const candidateModels = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-3.8-flash"
    ];

    let lastError = "";
    let data: any = null;

    for (const model of candidateModels) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: requestPayload,
                    signal: AbortSignal.timeout(12000)
                }
            );

            if (response.ok) {
                data = await response.json();
                if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.log(`Sucesso com modelo: ${model}`);
                    break;
                }
            }

            const errBody = await response.text();
            lastError = errBody;
            console.warn(`Modelo ${model} falhou (${response.status}):`, errBody);
        } catch (fetchErr: any) {
            lastError = fetchErr?.message || String(fetchErr);
            console.warn(`Timeout/erro de rede no modelo ${model}:`, lastError);
        }
    }

    if (!data || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error("Erro Google final:", lastError);
        throw new Error("Falha na API da Google: " + lastError);
    }

    let textResult = data.candidates[0].content.parts[0].text.trim();
    if (textResult.startsWith("```")) {
        textResult = textResult.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    const parsed = JSON.parse(textResult);
    const normalized = {
        mealName: parsed.mealName || "Refeição analisada",
        calories: Math.round(Number(parsed.calories) || 0),
        protein: Math.round(Number(parsed.protein) || 0),
        carbs: Math.round(Number(parsed.carbs) || 0),
        fat: Math.round(Number(parsed.fat) || 0),
        description: parsed.description || ""
    };

    return new Response(JSON.stringify(normalized), {
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
