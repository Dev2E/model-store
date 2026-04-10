// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS Configuration - Restringir apenas a origem segura
const getAllowedOrigins = (): string[] => {
  return [
    "http://localhost:5173", // Dev
    "http://localhost:5174", // Dev alternativo
    "http://127.0.0.1:5173",
    // "https://seu-dominio-producao.com", // Adicionar quando tiver produção
  ];
};

const corsHeaders = (origin?: string) => ({
  "Access-Control-Allow-Origin": getAllowedOrigins().includes(origin || "") ? origin : "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!accessToken) {
      return json(
        { error: "Access token não configurado" },
        { status: 500 }
      );
    }

    // Extrair payment_id da URL: /consultar-pagamento?payment_id=123456
    const url = new URL(req.url);
    const paymentId = url.searchParams.get("payment_id");

    if (!paymentId) {
      return json(
        { error: "payment_id obrigatório" },
        { status: 400 }
      );
    }

    // Consultar status no Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    const paymentData = (await response.json()) as Record<string, unknown>;

    return json({
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      transaction_amount: paymentData.transaction_amount,
      payment_method_id: paymentData.payment_method_id,
      cardholder_name: (paymentData.cardholder as Record<string, unknown>)?.name,
      last_four_digits: (paymentData.card as Record<string, unknown>)?.last_four_digits,
      payer_email: (paymentData.payer as Record<string, unknown>)?.email,
      external_reference: paymentData.external_reference,
    });
  } catch (error) {
    console.error("Erro:", error);
    return json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
});

function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    ...init,
  });
}
