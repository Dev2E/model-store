// Suprimir aviso de hero-icons no console
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = function (...args) {
    // Suprimir erro específico das hero-icons
    const errorStr = String(args[0] || '');
    const errorMsg = args[0]?.message || '';
    
    if (
      errorStr.includes('Cannot read properties of undefined') ||
      errorStr.includes('toLowerCase') ||
      errorMsg.includes('toLowerCase') ||
      errorStr.includes('Uncaught TypeError') ||
      (args[0] instanceof TypeError && (errorMsg.includes('toLowerCase') || errorMsg.includes('undefined')))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}
