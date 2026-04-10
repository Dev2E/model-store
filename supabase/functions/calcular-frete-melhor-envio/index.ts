// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { from, to, weight = 1000, height = 10, width = 15, length = 20 } =
      await req.json();

    if (!from || !to) {
      return new Response(
        JSON.stringify({
          error: "Faltam parâmetros: from, to",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const melhorEnvioToken = Deno.env.get("MELHOR_ENVIO_TOKEN");
    if (!melhorEnvioToken) {
      return new Response(
        JSON.stringify({
          error: "Token Melhor Envio não configurado",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Chamar API Melhor Envio
    const response = await fetch(
      "https://api.melhorenvio.com.br/api/v2/me/quote",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${melhorEnvioToken}`,
          "Content-Type": "application/json",
          "User-Agent": "loja-react/1.0",
        },
        body: JSON.stringify({
          from: {
            postal_code: from, // CEP origem (sua loja)
          },
          to: {
            postal_code: to, // CEP destino (cliente)
          },
          products: [
            {
              id: "1",
              width,
              height,
              length,
              weight,
              insurance_value: 0,
              quantity: 1,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Melhor Envio:", data);
      return new Response(
        JSON.stringify({
          error: data.message || "Erro ao calcular frete",
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Mapear resposta do Melhor Envio para formato padrão
    const metodos = data.map((servico: any) => ({
      id: servico.id,
      nome: servico.name,
      preco: parseFloat(servico.value) || 0,
      tempo_dias: servico.delivery_time || 0,
      empresa: servico.company?.name || "Correios",
    }));

    return new Response(JSON.stringify({ data: metodos }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro ao calcular frete:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Erro interno",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
