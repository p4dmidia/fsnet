import { useNavigate } from "react-router";
import { 
  Wifi, 
  CheckCircle,
  ArrowRight,
  ChevronRight
} from "lucide-react";

export default function Loja() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#0c5cb7' }}>
      {/* Futuristic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-orange-500/20" style={{ backgroundColor: '#0c5cb7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <img 
                src="https://mocha-cdn.com/019ac2fa-a558-7768-8e76-5c00fcfcc0ca/logo-hydrovive-(5).png" 
                alt="FSNet Logo"
                className="h-28 w-auto -my-4"
              />
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#inicio" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Início
              </a>
              <a href="/#vantagens" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Vantagens
              </a>
              <a href="/#como-funciona" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Como Funciona
              </a>
              <a href="/loja" className="text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Planos
              </a>
              <a href="/#comissoes" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Comissões
              </a>
            </nav>

            <button
              onClick={() => navigate("/")}
              className="group relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Voltar
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        {/* Animated Network Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #0c5cb7, #0a4d99, #0c5cb7)' }}></div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-6 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6">
            <span className="text-orange-300 font-bold text-sm uppercase tracking-wider">Planos Premium</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Conectividade
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Ultra-Rápida
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Fibra óptica de alta performance para sua casa ou empresa
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { speed: "300", price: "79,90", popular: false },
              { speed: "500", price: "99,90", popular: true },
              { speed: "800", price: "129,90", popular: false }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative group ${plan.popular ? 'md:-mt-4 md:scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/50">
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                <div className={`relative border-2 ${plan.popular ? 'border-orange-500 shadow-xl shadow-orange-500/20' : 'border-orange-500/30'} rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 h-full`} style={{ backgroundColor: '#0c5cb7' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/10 group-hover:to-orange-600/10 rounded-3xl transition-all duration-500"></div>
                  
                  <div className="relative">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/50 px-4 py-2 rounded-full mb-6">
                      <Wifi className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-300 font-bold">{plan.speed} MEGA</span>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-2xl text-gray-300 font-bold">R$</span>
                        <span className="text-6xl font-black text-white">{plan.price}</span>
                      </div>
                      <p className="text-gray-300 text-center">por mês</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {[
                        'Fibra Óptica Premium',
                        'Wi-Fi 6 Incluso',
                        'Velocidade Garantida',
                        'Suporte 24/7',
                        'Instalação Express'
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center text-gray-200">
                          <CheckCircle className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="https://fsnetseuprovedor.com.br/planos.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 flex items-center justify-center"
                    >
                      <span className="relative z-10 flex items-center">
                        ASSINAR AGORA
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Tem dúvidas sobre qual plano escolher?
            </p>
            <a
              href="https://fsnetseuprovedor.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-bold text-lg"
            >
              Entre em contato conosco
              <ChevronRight className="w-5 h-5 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-500/20 py-12" style={{ backgroundColor: '#0c5cb7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <img 
                src="https://mocha-cdn.com/019ac2fa-a558-7768-8e76-5c00fcfcc0ca/logo-hydrovive-(5).png" 
                alt="FSNet Logo"
                className="h-16 w-auto"
              />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Site oficial:{" "}
                <a
                  href="https://fsnetseuprovedor.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                >
                  fsnetseuprovedor.com.br
                </a>
              </p>
              <p className="text-sm text-gray-600">
                © 2025 FSNet. Tecnologia do Futuro.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
