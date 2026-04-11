// Serviço de Integração com Mercado Pago
export const mercadoPagoService = {
  publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,

  // Inicializar SDK Mercado Pago
  async initMercadoPago() {
    try {
      if (window.MercadoPago) {
        return window.MercadoPago;
      }

      // Carrega script do Mercado Pago
      const script = document.createElement('script');
      script.src = `https://sdk.mercadopago.com/js/v2`;
      script.async = true;
      
      return new Promise((resolve) => {
        script.onload = () => {
          const mp = new window.MercadoPago(this.publicKey, { locale: 'pt-BR' });
          resolve(mp);
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Erro ao inicializar Mercado Pago:', error);
      return null;
    }
  },

  // Criar preferência de pagamento (deve ser chamado do backend)
  async createPreference(orderData) {
    try {
      // Em produção, isso deve ser chamado do backend para segurança
      // Aqui estamos apenas preparando os dados
      const preference = {
        items: orderData.items.map(item => ({
          id: item.id,
          title: item.name,
          unit_price: parseFloat(item.price),
          quantity: item.quantity,
          picture_url: item.image || '',
        })),
        payer: {
          email: orderData.payer.email,
          name: orderData.payer.name,
          phone: {
            area_code: '55',
            number: orderData.payer.phone,
          },
          address: {
            zip_code: orderData.payer.zipCode,
            street_name: orderData.payer.street,
            street_number: orderData.payer.number,
          },
        },
        back_urls: {
          success: `${window.location.origin}/pedido-confirmado?payment_id={payment_id}`,
          failure: `${window.location.origin}/pagamento-recusado`,
          pending: `${window.location.origin}/pagamento-pendente`,
        },
        external_reference: orderData.orderId,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notification_url: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/webhooks/mercadopago`,
      };

      return preference;
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      return null;
    }
  },

  // Renderizar wallet Mercado Pago (botão de pagamento)
  async renderWallet(containerId, preferenceId) {
    try {
      const mp = await this.initMercadoPago();
      if (!mp) return false;

      const bricksBuilder = mp.bricks();

      return await bricksBuilder.create('wallet', {
        initialization: {
          preferenceId: preferenceId,
        },
        customization: {
          texts: {
            valueProp: 'security_safety',
          },
        },
        onReady: () => {
          console.log('Mercado Pago Wallet pronto');
        },
        onError: (error) => {
          console.error('Erro ao carregar Wallet:', error);
        },
      });
    } catch (error) {
      console.error('Erro ao renderizar wallet:', error);
      return false;
    }
  },

  // Renderizar formulário de cartão
  async renderCardForm(containerId, preferenceId) {
    try {
      const mp = await this.initMercadoPago();
      if (!mp) return false;

      const bricksBuilder = mp.bricks();

      return await bricksBuilder.create('payment', {
        initialization: {
          amount: 0, // Será definido dinamicamente
          preferenceId: preferenceId,
        },
        customization: {
          visual: {
            hidePaymentMethod: ['atm', 'ticket'],
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            wallet_purchase: 'all',
          },
        },
        callbacks: {
          onReady: () => {
            console.log('Formulário de Pagamento pronto');
          },
          onSubmit: (data) => {
            console.log('Dados de pagamento:', data);
            return new Promise((resolve) => {
              // Aqui você chamaria seu backend para processar o pagamento
              resolve();
            });
          },
          onError: (error) => {
            console.error('Erro no formulário:', error);
          },
        },
      });
    } catch (error) {
      console.error('Erro ao renderizar formulário:', error);
      return false;
    }
  },

  // Processar pagamento (deve ser chamado do backend)
  async processPayment(paymentData) {
    try {
      // Esta função deve ser implementada no backend com o Access Token
      // Aqui apenas retornamos um objeto de exemplo
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return null;
    }
  },

  // Verificar status de pagamento
  async checkPaymentStatus(paymentId) {
    try {
      // Esta deve ser uma chamada de backend segura
      const response = await fetch(`/api/payments/status/${paymentId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return null;
    }
  },

  // Formatar valores para Mercado Pago (sem decimais)
  formatAmount(amount) {
    return Math.round(parseFloat(amount) * 100);
  },

  // Desformatar valores para exibição
  unformatAmount(amount) {
    return (amount / 100).toFixed(2);
  },
};

export default mercadoPagoService;
