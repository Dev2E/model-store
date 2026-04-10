export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner Animado */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-3xl font-bold text-white font-manrope mb-2">Carregando...</h1>
        <p className="text-slate-400 mb-8">Aguarde um momento enquanto preparamos tudo para você</p>

        {/* Loading bar simulado */}
        <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{width: '70%'}}></div>
        </div>

        {/* Dicas */}
        <div className="mt-12 max-w-md">
          <p className="text-slate-500 text-sm">
            ✨ Iniciando servidor...
          </p>
          <p className="text-slate-500 text-sm mt-2">
            🔄 Sincronizando dados...
          </p>
          <p className="text-slate-500 text-sm mt-2">
            ⏳ Quase pronto!
          </p>
        </div>
      </div>
    </main>
  );
}
