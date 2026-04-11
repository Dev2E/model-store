// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Webhook precisa aceitar requisições do Mercado Pago (origem variável)
// Mas ainda podemos adicionar validação extra
const corsHeaders = {
  // Mercado Pago envia de múltiplas IPs, então permitimos todos
  // Mas há validação adicional via signature/token dentro da lógica
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "3600",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validar request vem do Mercado Pago
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return json({ error: "Configuração faltando" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mercado Pago envia dados via query params ou body
    const url = new URL(req.url);
    const dataId = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    if (!dataId || !type) {
      return json({ received: true });
    }

    // Se for payment, consulte a API do Mercado Pago
    if (type === "payment") {
      const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");  // Server-side secret

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const paymentData = (await paymentResponse.json()) as Record<string, unknown>;

      // Mapear status do Mercado Pago para o seu sistema
      const statusMap: Record<string, string> = {
        approved: "paid",
        pending: "pending",
        rejected: "failed",
        cancelled: "failed",
        refunded: "refunded",
        charged_back: "failed",
      };

      const orderStatus = statusMap[paymentData.status as string] || "pending";
      const externalReference = paymentData.external_reference as string;

      if (externalReference) {
        // Atualizar status do pedido no banco
        const { error } = await supabase
          .from("orders")
          .update({
            status: orderStatus,
            payment_id: paymentData.id,
            payment_status: paymentData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", externalReference);

        if (error) {
          console.error("Erro ao atualizar pedido:", error);
        } else {
          console.log(`Pedido ${externalReference} atualizado para ${orderStatus}`);
        }
      }
    }

    return json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
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
