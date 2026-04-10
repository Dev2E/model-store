// Função para validar e buscar endereço via ViaCEP (API pública)
export const buscarEnderecoByCEP = async (cep) => {
  // Remover caracteres não-numéricos
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    return { error: 'CEP deve ter 8 dígitos' };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      return { error: 'CEP não encontrado' };
    }

    return {
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      error: null
    };
  } catch (err) {
    return { error: 'Erro ao buscar CEP. Tente novamente.' };
  }
};

// Função para formatar CEP (XX.XXX-XXX)
export const formatarCEP = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length <= 5) return cepLimpo;
  if (cepLimpo.length <= 8) return cepLimpo.slice(0, 5) + '-' + cepLimpo.slice(5);
  return cepLimpo;
};
