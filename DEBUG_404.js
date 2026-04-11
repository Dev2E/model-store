// 📋 GUIA DE DEBUG - Investigando erro 404
// Execute este código no console do navegador (F12 > Console)

// 1. LISTAR TODAS AS REQUISIÇÕES QUE RETORNARAM 404
(function debugNetwork() {
  console.log('%c🔍 INVESTIGANDO ERROS 404...', 'color: blue; font-size: 14px; font-weight: bold');
  
  // Verificar no Performance API
  const resources = performance.getEntriesByType('resource');
  const errors404 = resources.filter(r => r.transferSize > 0 && r.name.includes('404'));
  
  console.log('\n📌 Requisições com status 404:');
  resources.forEach(resource => {
    const name = resource.name;
    const duration = Math.round(resource.duration);
    
    if (name.includes('404') || name.includes('api') || name.includes('supabase')) {
      console.log(`  ❌ ${name} (${duration}ms)`);
    }
  });
  
  // Check localStorage para erros
  console.log('\n💾 Erros armazenados:');
  const errors = localStorage.getItem('app_errors');
  if (errors) {
    console.log(JSON.parse(errors));
  }
})();

// 2. MONITORAR TODAS AS REQUISIÇÕES EM TEMPO REAL
window.DEBUG_MODE = true;

// Interceptar fetch
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const [resource, config] = args;
  const method = config?.method || 'GET';
  
  console.log(`📡 ${method} ${resource}`);
  
  try {
    const response = await originalFetch.apply(this, args);
    
    if (!response.ok) {
      console.error(`   ❌ Status ${response.status}: ${resource}`);
      
      // Armazenar erro
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push({
        url: resource,
        status: response.status,
        method,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10))); // Manter últimos 10
    } else {
      console.log(`   ✅ Status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`   🚫 ${error.message}`);
    throw error;
  }
};

console.log('%c✅ Debug mode ativado!', 'color: green; font-weight: bold');
console.log('Abra a aba Network no DevTools para ver todas as requisições');
