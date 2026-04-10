import { supabase } from '../lib/supabase';
import { buscarEnderecoByCEP } from './cepService';

// Métodos de envio padrão
const METODOS_PADRAO = [
  { id: 1, nome: 'SEDEX', preco: 25.00, tempo_dias: 2, ativo: true },
  { id: 2, nome: 'PAC', preco: 15.00, tempo_dias: 7, ativo: true },
  { id: 3, nome: 'Expresso', preco: 40.00, tempo_dias: 1, ativo: true },
];

// Cálculo de frete baseado em CEP
export const shippingService = {
  // Buscar métodos de envio disponíveis para um CEP
  async getShippingMethods(cep) {
    try {
      // Primeiro, valida e busca endereco pelo CEP
      const { rua, bairro, cidade, estado, error: cepError } = await buscarEnderecoByCEP(cep);
      
      if (cepError) {
        return { data: null, error: 'CEP inválido' };
      }

      // Tenta buscar do banco, mas usa padrão se falhar
      let metodos = METODOS_PADRAO;
      
      try {
        const { data: metodosDB, error: metodosError } = await supabase
          .from('shipping_methods')
          .select('*')
          .eq('ativo', true);

        if (metodosDB && metodosDB.length > 0) {
          metodos = metodosDB;
        }
      } catch (err) {
        console.log('Usando métodos de frete padrão');
      }

      // Calcula preço ajustado baseado na região
      const metodosComPreco = metodos.map(metodo => {
        const multiplicador = this.calcularMultiplicadorRegiao(estado);
        const precoBaseAjustado = parseFloat(metodo.preco) * multiplicador;

        return {
          ...metodo,
          preco_original: parseFloat(metodo.preco),
          preco_ajustado: parseFloat(precoBaseAjustado.toFixed(2)),
          multiplicador: multiplicador.toFixed(2),
          regiao: this.obterRegiao(estado),
          estado: estado,
          cidade: cidade,
          tempo_entrega_ajustado: this.calcularTempoEntrega(metodo.tempo_dias || 0, estado),
        };
      });

      return { 
        data: metodosComPreco, 
        address: { rua, bairro, cidade, estado },
        error: null 
      };
    } catch (error) {
      console.error('Erro ao buscar frete:', error);
      return { data: null, error: 'Erro ao buscar informações de frete' };
    }
  },

  // Calcula multiplicador de preço por região
  calcularMultiplicadorRegiao(estado) {
    // UF: estado
    // Regiões: Sul (mais barato), Sudeste (padrão), Nordeste, Norte, Centro-Oeste (mais caro)
    const regioes = {
      // Sul
      'RS': 1.0, 'SC': 1.0, 'PR': 1.0,
      // Sudeste
      'SP': 1.0, 'RJ': 1.0, 'MG': 1.1, 'ES': 1.1,
      // Nordeste
      'BA': 1.2, 'PE': 1.2, 'CE': 1.2, 'RN': 1.2, 'PB': 1.2, 'AL': 1.2, 'SE': 1.2, 'PI': 1.2, 'MA': 1.2,
      // Norte
      'AM': 1.5, 'PA': 1.5, 'AC': 1.5, 'AP': 1.5, 'RR': 1.5, 'RO': 1.5, 'TO': 1.4,
      // Centro-Oeste
      'MT': 1.3, 'MS': 1.2, 'GO': 1.2, 'DF': 1.1,
    };

    return regioes[estado.toUpperCase()] || 1.2;
  },

  // Obtém nome da região
  obterRegiao(estado) {
    const regioes = {
      'RS': 'Sul', 'SC': 'Sul', 'PR': 'Sul',
      'SP': 'Sudeste', 'RJ': 'Sudeste', 'MG': 'Sudeste', 'ES': 'Sudeste',
      'BA': 'Nordeste', 'PE': 'Nordeste', 'CE': 'Nordeste', 'RN': 'Nordeste', 'PB': 'Nordeste', 'AL': 'Nordeste', 'SE': 'Nordeste', 'PI': 'Nordeste', 'MA': 'Nordeste',
      'AM': 'Norte', 'PA': 'Norte', 'AC': 'Norte', 'AP': 'Norte', 'RR': 'Norte', 'RO': 'Norte', 'TO': 'Norte',
      'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'DF': 'Centro-Oeste',
    };

    return regioes[estado.toUpperCase()] || 'Desconhecida';
  },

  // Calcula tempo de entrega ajustado por região
  calcularTempoEntrega(diasBase, estado) {
    const multiplicadores = {
      // Sul e Sudeste: entrega mais rápida
      'RS': 0.9, 'SC': 0.9, 'PR': 0.9,
      'SP': 1.0, 'RJ': 1.0, 'MG': 1.1, 'ES': 1.1,
      // Nordeste
      'BA': 1.3, 'PE': 1.4, 'CE': 1.4, 'RN': 1.5, 'PB': 1.5, 'AL': 1.5, 'SE': 1.5, 'PI': 1.5, 'MA': 1.5,
      // Norte: entrega bem mais lenta
      'AM': 2.0, 'PA': 2.0, 'AC': 2.2, 'AP': 2.2, 'RR': 2.2, 'RO': 2.0, 'TO': 1.8,
      // Centro-Oeste
      'MT': 1.5, 'MS': 1.3, 'GO': 1.2, 'DF': 1.0,
    };

    const mult = multiplicadores[estado.toUpperCase()] || 1.3;
    return Math.ceil(diasBase * mult);
  },

  // Método helper para validar e calcular frete direto
  async calcularFrete(cep, peso = 1, dimensoes = {}) {
    const { data: metodos, address, error } = await this.getShippingMethods(cep);
    
    if (error) {
      return { data: null, error };
    }

    // Aplica ajustes por peso (opcional)
    const metodosAjustados = metodos.map(metodo => {
      const ajustePeso = Math.max(1, peso / 5); // Cada 5kg = 1x preço de peso
      return {
        ...metodo,
        preco_final: parseFloat((metodo.preco_ajustado * ajustePeso).toFixed(2)),
        descricao: `${metodo.nome} - Entrega em ${metodo.tempo_entrega_ajustado} dias (${metodo.regiao})`,
      };
    });

    return { 
      data: metodosAjustados, 
      address,
      error: null 
    };
  },
};

export default shippingService;
