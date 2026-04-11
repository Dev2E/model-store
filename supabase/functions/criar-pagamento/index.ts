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
  size?: string;
  color?: string;
  price: number;
  quantity: number;
}

interface PayerInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
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
  const origin = req.headers.get("origin") || "";
  
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!accessToken) {
      console.error("Access token não configurado");
      return json(
        { error: "Access token não configurado" },
        { init: { status: 500 }, origin }
      );
    }

    let body: RequestBody;
    try {
      body = await req.json() as RequestBody;
    } catch (parseErr) {
      console.error("Erro ao fazer parse do JSON:", parseErr);
      return json(
        { error: "Erro ao fazer parse do JSON", details: String(parseErr) },
        { init: { status: 400 }, origin }
      );
    }

    console.log("Body recebido:", body);

    // Validar dados obrigatórios
    if (!body.items || body.items.length === 0) {
      console.error("Erro: Items são obrigatórios");
      return json(
        { error: "Items são obrigatórios" },
        { init: { status: 400 }, origin }
      );
    }

    if (!body.payer || !body.payer.name || !body.payer.email) {
      console.error("Erro: Dados do pagador incompletos", body.payer);
      return json(
        { error: "Dados do pagador incompletos", received: body.payer },
        { init: { status: 400 }, origin }
      );
    }

    if (!body.orderId) {
      console.error("Erro: OrderId é obrigatório");
      return json(
        { error: "OrderId é obrigatório" },
        { init: { status: 400 }, origin }
      );
    }

    // Validar phone
    if (!body.payer.phone) {
      console.error("Erro: Telefone é obrigatório");
      return json(
        { error: "Telefone é obrigatório" },
        { init: { status: 400 }, origin }
      );
    }

    // Validar CPF
    if (!body.payer.cpf) {
      console.error("Erro: CPF é obrigatório");
      return json(
        { error: "CPF é obrigatório" },
        { init: { status: 400 }, origin }
      );
    }

    // Validar que CPF tem 11 dígitos
    const cpfClean = body.payer.cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      console.error("Erro: CPF inválido (deve ter 11 dígitos)");
      return json(
        { error: "CPF inválido (deve ter 11 dígitos)" },
        { init: { status: 400 }, origin }
      );
    }

    // Extrair número do endereço, validar se é um número
    let streetNumber = 0;
    if (body.payer.number) {
      const numStr = body.payer.number.replace(/\D/g, "");
      streetNumber = parseInt(numStr) || 0;
      if (streetNumber === 0 && body.payer.number.length > 0) {
        console.warn("Aviso: street_number não contém dígitos válidos. Usando 0 como padrão.");
      }
    }

    const mpItems = body.items.map((item) => ({
      id: item.id,
      title: `${item.name}${item.size ? ` - Tamanho: ${item.size}` : ''}${item.color ? ` - Cor: ${item.color}` : ''}`,
      unit_price: Math.round(parseFloat(item.price as unknown as string) * 100) / 100,
      quantity: parseInt(item.quantity as unknown as string) || 1,
      currency_id: "BRL",
    }));

    console.log("MP Items:", mpItems);

    // Preparar dados para Mercado Pago
    const preference = {
      items: mpItems,
      payer: {
        name: body.payer.name,
        email: body.payer.email,
        phone: {
          area_code: "55",
          number: body.payer.phone.replace(/\D/g, "") || "00000000000",
        },
        identification: {
          type: "CPF",
          number: cpfClean,
        },
        address: {
          street_name: body.payer.street || "Rua N/A",
          street_number: streetNumber,
          zip_code: body.payer.zipCode?.replace(/\D/g, "") || "00000000",
          city_name: body.payer.city || "Sem cidade",
          state_name: body.payer.state || "SP",
        },
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      payer_email: body.payer.email,
      back_urls: {
        success: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/pedido-confirmado`,
        failure: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/pagamento-recusado`,
        pending: `${Deno.env.get("FRONTEND_URL") || "http://localhost:5173"}/pagamento-pendente`,
      },
      auto_return: "approved",
      external_reference: body.orderId,
      sandbox_mode: Deno.env.get("MERCADOPAGO_SANDBOX_MODE") === "true" || Deno.env.get("VITE_SANDBOX_MODE") === "true",
    };

    // Log apenas em desenvolvimento
    if (Deno.env.get("ENVIRONMENT") === "dev") {
      console.log("Enviando para Mercado Pago (DEV):", preference);
    }

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
      console.error("Erro Mercado Pago:", error, "Status:", mpResponse.status);
      return json(
        { 
          error: "Erro ao criar preferência no Mercado Pago",
          status: mpResponse.status,
          details: error 
        },
        { init: { status: 400 }, origin }
      );
    }

    let mpData;
    try {
      mpData = await mpResponse.json() as Record<string, unknown>;
    } catch (jsonErr) {
      console.error("Erro ao fazer parse da resposta MP:", jsonErr);
      return json(
        { 
          error: "Erro ao processar resposta do Mercado Pago",
          details: String(jsonErr)
        },
        { init: { status: 500 }, origin }
      );
    }

    if (!mpData.id || !mpData.init_point) {
      console.error("Resposta MP sem id ou init_point:", mpData);
      return json(
        { 
          error: "Resposta inválida do Mercado Pago",
          received: mpData
        },
        { init: { status: 500 }, origin }
      );
    }

    console.log("Preferência criada com sucesso:", mpData.id);

    return json(
      {
        success: true,
        preferenceId: mpData.id,
        initPoint: mpData.init_point,
      },
      { init: { status: 200 }, origin }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Erro não tratado:", errorMsg, error);
    return json(
      { 
        error: "Erro interno ao processar pagamento",
        message: errorMsg
      },
      { init: { status: 500 }, origin }
    );
  }
});

function json(data: unknown, options?: { init?: ResponseInit; origin?: string }): Response {
  const origin = options?.origin || "";
  const status = options?.init?.status || 200;
  
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 
      ...corsHeaders(origin), 
      "Content-Type": "application/json",
      ...(options?.init?.headers || {})
    },
  });
}
