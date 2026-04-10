import { Link } from 'react-router-dom';

export default function Sobre() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-16 max-w-7xl mx-auto items-center">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">SOBRE BOUTIQUE</p>
          <h1 className="text-5xl font-bold font-manrope mb-6 leading-tight">
            A Galeria Digital de Curação.
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Boutique é um espaço editorial para descobrir, cuidar e possuir objetos que enriquecem a vida moderna. 
            Acreditamos que design excelente não é sobre ostentação—é sobre intenção, funcionalidade e beleza harmoniosa.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Cada item em nossa coleção é meticulosamente selecionado por nossos curadores apaixonados por qualidade e sustentabilidade.
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-96 rounded-lg flex items-center justify-center text-8xl">
          🏪
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto border-y border-gray-200">
        <h2 className="text-4xl font-bold font-manrope mb-12 text-center">Nossos Valores</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold font-manrope mb-3">Curações Intencionais</h3>
            <p className="text-gray-600">
              Cada seleção passa por um rigoroso processo de curação para garantir qualidade, beleza e funcionalidade.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg mb-4">
              🌱
            </div>
            <h3 className="text-xl font-bold font-manrope mb-3">Sustentabilidade</h3>
            <p className="text-gray-600">
              Comprometidos com práticas éticas e sustentáveis que respeitam as pessoas e o planeta.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg mb-4">
              ❤️
            </div>
            <h3 className="text-xl font-bold font-manrope mb-3">Artesanato Excepcional</h3>
            <p className="text-gray-600">
              Celebramos a excelência em artesanato e a dedicação dos criadores por trás de cada objeto.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold font-manrope mb-12 text-center">Nossos Curadores</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Studio de Design', role: 'Curadora Sênior', image: '👩‍🎨' },
            { name: 'Artesano Local', role: 'Especialista em Craft', image: '👨‍🏭' },
            { name: 'Sustentabilista', role: 'Diretora de Impacto', image: '👨‍💼' },
            { name: 'Historiadora', role: 'Pesquisa de Tendências', image: '👩‍💼' },
          ].map((member, i) => (
            <div key={i} className="text-center">
              <div className="bg-gray-200 w-full h-48 rounded-lg flex items-center justify-center text-5xl mb-4">
                {member.image}
              </div>
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto bg-gray-50 rounded-lg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold font-manrope mb-6 text-center">Nossa Missão</h2>
          <p className="text-lg text-gray-600 leading-relaxed text-center mb-8">
            "Democratizar o acesso a design de qualidade e criar uma comunidade de indivíduos que enxergam beleza 
            como uma forma de autocuidado e expressão pessoal. Acreditamos que todos merecem viver em espaços que 
            os inspirem e que o bom design é um direito, não um luxo."
          </p>
          <div className="text-center">
            <Link to="/contato">
              <button className="bg-gray-800 text-white px-8 py-3 font-semibold hover:bg-gray-900 transition">
                Trabalhe Conosco
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
