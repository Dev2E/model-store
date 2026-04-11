// Formatadores para valores brasileiros

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'R$ 0,00';
  
  // Converter para número, removendo qualquer caractere não numérico
  let numValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d.-]/g, ''))
    : parseFloat(value);
  
  if (isNaN(numValue) || numValue === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const formatCurrencyWithoutSymbol = (value) => {
  if (value === null || value === undefined) return '0,00';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '0,00';
  
  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
