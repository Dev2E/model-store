// Suprimir aviso de hero-icons no console
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = function (...args) {
    // Suprimir erro específico das hero-icons
    if (
      args[0]?.includes?.('Cannot read properties of undefined') ||
      args[0]?.includes?.('toLowerCase') ||
      (args[0] instanceof TypeError && args[0].message?.includes('toLowerCase'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}
