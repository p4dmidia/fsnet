import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/shared/authContext";
import { 
  Wifi, 
  DollarSign, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Loader2,
  BarChart3,
  Sparkles,
  ChevronRight,
  Network,
  MessageCircle
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { isPending } = useAuth();
  
  // Typing animation state
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const textsToType = [
    "renda extra",
    "comissões mensais",
    "dinheiro no bolso"
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textsToType[loopNum % textsToType.length];
      
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        setTypingSpeed(150);
        
        if (displayText === currentText) {
          setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        setTypingSpeed(100);
        
        if (displayText === "") {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          return;
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  // Redirecionamentos legacy removidos; fluxo atual usa /login e /cadastro

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#0c5cb7' }}>
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#0c5cb7' }}>
      {/* Futuristic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-orange-500/20" style={{ backgroundColor: '#0c5cb7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="https://mocha-cdn.com/019ac2fa-a558-7768-8e76-5c00fcfcc0ca/logo-hydrovive-(5).png" 
                alt="FSNet Logo"
                className="h-28 w-auto -my-4"
              />
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Início
              </a>
              <a href="#vantagens" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Vantagens
              </a>
              <a href="#como-funciona" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Como Funciona
              </a>
              <a href="/loja" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Planos
              </a>
              <a href="#comissoes" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Comissões
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/cadastro')}
                className="px-4 py-2.5 border-2 border-orange-500/60 text-orange-300 font-bold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all"
              >
                Cadastro
              </button>
              <button
                onClick={() => navigate('/login')}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  Login
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => navigate('/login')}
                aria-label="Ir para login"
              ></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated Network Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #0c5cb7, #0a4d99, #0c5cb7)' }}></div>
          
          {/* Network Lines Animation */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Animated network lines */}
            <g className="network-lines">
              <line x1="10%" y1="20%" x2="90%" y2="30%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" />
              <line x1="20%" y1="40%" x2="80%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <line x1="15%" y1="70%" x2="85%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <line x1="30%" y1="10%" x2="70%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
              <line x1="5%" y1="50%" x2="95%" y2="45%" stroke="url(#lineGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Network nodes */}
              <circle cx="10%" cy="20%" r="6" fill="#f97316" className="animate-pulse" />
              <circle cx="90%" cy="30%" r="6" fill="#f97316" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="20%" cy="40%" r="8" fill="#ea580c" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
              <circle cx="80%" cy="60%" r="8" fill="#ea580c" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
              <circle cx="15%" cy="70%" r="6" fill="#f97316" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
              <circle cx="85%" cy="50%" r="6" fill="#f97316" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
              <circle cx="30%" cy="10%" r="7" fill="#fb923c" className="animate-pulse" style={{ animationDelay: '1.8s' }} />
              <circle cx="70%" cy="80%" r="7" fill="#fb923c" className="animate-pulse" style={{ animationDelay: '2.1s' }} />
              <circle cx="50%" cy="50%" r="10" fill="#f97316" className="animate-pulse" style={{ animationDelay: '2.4s' }} />
            </g>
          </svg>
          
          {/* Particle Effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-500 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading with Typing Effect */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              <span className="block mb-2">Transforme sua rede de contatos em</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient min-h-[1.2em] text-5xl md:text-7xl">
                {displayText}
                <span className="animate-blink">|</span>
              </span>
              <span className="block mt-2">com a FSNet.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Não precisa vender, apenas indicar. Recomende a melhor internet fibra óptica da região e receba comissões atraentes direto na sua conta por cada instalação aprovada. <span className="text-orange-400 font-semibold">Sem investimento inicial.</span>
            </p>

            {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <div className="flex flex-col items-center">
                  <button
                  onClick={() => navigate('/cadastro')}
                  className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                    FAZER CADASTRO DE AFILIADO
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <p className="text-sm text-gray-400 mt-3">Cadastro 100% gratuito e aprovado em minutos</p>
                </div>
                
                <a
                  href="https://fsnetseuprovedor.com.br/planos.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-10 py-5 bg-white/5 backdrop-blur-sm text-white text-lg font-bold rounded-xl border-2 border-orange-500/30 hover:border-orange-500/60 hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                >
                  Explorar Planos
                  <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-orange-500/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Problema/Solução Section */}
      <section className="relative py-32 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Procurando uma forma inteligente de monetizar sua influência?
              </h3>
              <div className="space-y-4 text-lg text-white leading-relaxed">
                <p>
                  Você já indica filmes, restaurantes e serviços para seus amigos e vizinhos de graça. Por que não ganhar dinheiro indicando algo que todo mundo precisa?
                </p>
                <p>
                  Com o Programa de Afiliados FSNet, você transforma conversas casuais e grupos de WhatsApp em uma máquina de vendas. Nós cuidamos da infraestrutura, do suporte e da instalação. <span className="font-bold text-white">O seu único trabalho é compartilhar seu link exclusivo.</span>
                </p>
                <p className="text-2xl font-bold mt-8 text-white">
                  É simples: Você indica, a FSNet instala, você lucra.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://mocha-cdn.com/019ac2fa-a558-7768-8e76-5c00fcfcc0ca/fsnet-img-(1).png" 
                alt="Network"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="vantagens" className="relative py-32" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Por que ser um
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Afiliado FSNet?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Produto Fácil de Vender",
                description: "Internet é necessidade básica. Com a qualidade e estabilidade da FSNet, o produto praticamente se vende sozinho.",
                gradient: "from-orange-400 to-orange-600"
              },
              {
                icon: BarChart3,
                title: "Painel de Controle Transparente",
                description: "Saiba exatamente quantos cliques seu link teve, quantas vendas foram convertidas e quanto você tem de saldo a receber.",
                gradient: "from-orange-400 to-orange-600"
              },
              {
                icon: Award,
                title: "Material de Apoio Gratuito",
                description: "Não é designer? Não tem problema. Disponibilizamos artes prontas para Stories, Feed e WhatsApp para você só copiar e colar.",
                gradient: "from-orange-400 to-orange-600"
              },
              {
                icon: DollarSign,
                title: "Pagamentos Pontuais",
                description: "Segurança é nossa prioridade. Receba suas comissões via PIX ou transferência bancária nas datas combinadas, sem burocracia.",
                gradient: "from-orange-400 to-orange-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative border-2 border-orange-500/30 rounded-3xl p-8 hover:border-orange-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: '#0c5cb7' }}
              >
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="relative py-32" style={{ backgroundColor: '#0c5cb7' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.05) 2px, transparent 2px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.05) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Comece a faturar em
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                apenas 3 passos
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Cadastre-se Gratuitamente",
                description: "Crie sua conta em nosso painel de parceiros em menos de 2 minutos. Tenha acesso imediato ao seu escritório virtual.",
                icon: Users
              },
              {
                step: "02",
                title: "Divulgue seu Link",
                description: "Copie seu link personalizado ou use nossos banners prontos para postar nas redes sociais, grupos de condomínio e para amigos.",
                icon: Network
              },
              {
                step: "03",
                title: "Receba sua Comissão",
                description: "Assim que o cliente indicado tiver a internet instalada e ativa, sua comissão é garantida. Acompanhe tudo em tempo real e solicite o saque.",
                icon: DollarSign
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-orange-500/20 rounded-3xl p-10 hover:border-orange-500/50 transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/10 group-hover:to-orange-600/10 rounded-3xl transition-all duration-500"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-6xl font-black text-white/10">{item.step}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem é este programa */}
      <section className="relative py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Para quem é
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                este programa?
              </span>
            </h2>
            <p className="text-xl text-gray-600">Este programa é perfeito para você que:</p>
          </div>

          <div className="rounded-3xl p-12 border-2 border-orange-500/30" style={{ backgroundColor: '#0c5cb7' }}>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Quer uma renda extra sem sair de casa (Home Office).",
                "É síndico, zelador ou tem influência em seu bairro/condomínio.",
                "É técnico de informática ou presta serviços de TI.",
                "É influenciador digital local ou dono de páginas regionais.",
                "Já é cliente FSNet e ama nossa conexão."
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="w-7 h-7 text-orange-400 flex-shrink-0 mt-1" />
                  <p className="text-lg text-white font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="relative py-32" style={{ backgroundColor: '#0c5cb7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Quem indica, confia e lucra
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-orange-500/30 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                  C
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Carlos M.</div>
                  <div className="text-orange-300 text-sm">Afiliado FSNet</div>
                </div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed italic">
                "Eu já recomendava a FSNet porque a internet é ótima. Quando vi que podia ganhar dinheiro com isso, mandei no grupo do condomínio. No primeiro mês paguei minha própria conta de luz só com as comissões!"
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-orange-500/30 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                  J
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Juliana S.</div>
                  <div className="text-orange-300 text-sm">Técnica de TI e Parceira</div>
                </div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed italic">
                "O painel é muito fácil de usar. Trabalho com manutenção de computadores e agora, para todo cliente que atendo, ofereço a internet. É um dinheiro extra que entra todo mês."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="comissoes" className="relative py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                COMISSÕES
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recomende a melhor internet fibra óptica da região e receba comissões atraentes direto na sua conta por cada instalação aprovada.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { speed: "300", price: "79,90", commission: "20,00", popular: false },
              { speed: "500", price: "99,90", commission: "50,00", popular: true },
              { speed: "800", price: "129,90", commission: "100,00", popular: false }
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

                    <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/50 rounded-2xl p-6 text-center">
                      <div className="text-sm text-orange-300 font-bold mb-2">SUA COMISSÃO</div>
                      <div className="text-4xl font-black text-orange-400">R$ {plan.commission}</div>
                      <div className="text-xs text-orange-300 mt-1">por venda aprovada</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Perguntas
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Frequentes
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Preciso pagar para me cadastrar?",
                answer: "Não! O programa de afiliados FSNet é totalmente gratuito."
              },
              {
                question: "Preciso entender de tecnologia para vender?",
                answer: "De jeito nenhum. Você só precisa compartilhar o link. Nossa equipe técnica cuida de toda a explicação complexa e instalação."
              },
              {
                question: "Como eu sei que a venda veio de mim?",
                answer: "Nosso sistema utiliza cookies e rastreamento avançado. Quando alguém clica no seu link exclusivo, o sistema 'marca' aquele visitante. Mesmo que ele feche o site e volte depois para comprar, a comissão vai para você."
              },
              {
                question: "Quando eu recebo meu pagamento?",
                answer: "Os pagamentos são processados mensalmente para vendas confirmadas e instaladas no período anterior."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-orange-500 transition-all duration-300">
                <summary className="cursor-pointer p-6 flex items-center justify-between font-bold text-xl text-gray-900 hover:text-orange-600 transition-colors">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-6 h-6 text-orange-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-700 text-lg leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Pare de deixar dinheiro na mesa.
          </h2>
          
          <p className="text-2xl text-white/90 mb-12 font-light">
            A internet que seus amigos usam pode virar dinheiro no seu bolso ainda hoje.
          </p>

              <button
                onClick={() => navigate('/login')}
                className="group relative px-16 py-7 bg.white text-orange-600 text-2xl font-black rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl inline-flex items-center justify-center"
              >
                <span className="relative z-10">
                  FAZER LOGIN
                </span>
              </button>
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
              <p className="text-white mb-2">
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
              <p className="text-sm text-white">
                © 2025 Todos os direitos reservados - FSNet. Tecnologia do Futuro - Desenvolvido por
                {" "}
                <a
                  href="https://www.p4dmidia.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                >
                  P4D Mídia
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5571992027955?text=Ol%C3%A1%2C%20quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20programa%20de%20indica%C3%A7%C3%A3o%20da%20FS%20NET!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group-hover:shadow-green-500/50">
            <MessageCircle className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>
      </a>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { 
            transform: translateY(-100px) translateX(50px);
            opacity: 0.8;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
