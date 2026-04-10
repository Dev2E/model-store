// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS Configuration - Restringir apenas a origem segura
const getAllowedOrigins = (): string[] => {
  // Backend: Edge Function
  // Frontend: Seu domínio (atualizar quando em produção)
  return [
    "http://localhost:5173", // Dev
    "http://localhost:5174", // Dev alternativo
    "http://127.0.0.1:5173",
    // "https://seu-dominio-producao.com", // Adicionar quando tiver produção
  ];
};

const corsHeaders = (origin?: string) => ({
  "Access-Control-Allow-Origin": getAllowedOrigins().includes(origin || "") ? origin : "http://localhost:5173",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PayerInfo {
  name: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

interface RequestBody {
  items: CartItem[];
  payer: PayerInfo;
  orderId: string;
}

serve(async (req: Request) => {
  // CORS Preflight
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

    const body = (await req.json()) as RequestBody;

    // Validar dados
    if (!body.items || !body.payer || !body.orderId) {
      return json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Preparar items para Mercado Pago
    const mpItems = body.items.map((item) => ({
      id: item.id,
      title: item.name,
      unit_price: Math.round(item.price * 100) / 100,
      quantity: item.quantity,
      currency_id: "BRL",
    }));

    // Preparar dados para Mercado Pago
    const preference = {
      items: mpItems,
      payer: {
        name: body.payer.name,
        email: body.payer.email,
        phone: {
          area_code: "",
          number: body.payer.phone,
        },
        address: {
          street_name: body.payer.street,
          street_number: parseInt(body.payer.number) || 0,
          zip_code: body.payer.zipCode,
          city_name: body.payer.city,
          state_name: body.payer.state,
        },
      },
      back_urls: {
        success: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/pedido-confirmado`,
        failure: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/pagamento-recusado`,
        pending: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/pagamento-pendente`,
      },
      auto_return: "approved",
      external_reference: body.orderId,
      notification_url: `${Deno.env.get("WEBHOOK_URL") || "https://seu_dominio/webhooks/mercadopago"}`,
    };

    // Fazer requisição para Mercado Pago
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      const error = await mpResponse.text();
      console.error("Erro Mercado Pago:", error);
      return json(
        { error: "Erro ao criar preferência" },
        { status: mpResponse.status }
      );
    }

    const mpData = (await mpResponse.json()) as Record<string, unknown>;

    return json(
      {
        success: true,
        preferenceId: mpData.id,
        initPoint: mpData.init_point,
      },
      { status: 200 }
    );
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
