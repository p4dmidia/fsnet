import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/shared/authContext";
import { Mail, KeyRound, Loader2, ArrowRight } from "lucide-react";
import { signInWithPassword } from "@/shared/auth";

export default function Login() {
  const navigate = useNavigate();
  const { redirectToLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithPassword(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#0c5cb7' }}>
      {/* Header (same as Cadastro) */}
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
              <a href="/#inicio" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">Início</a>
              <a href="/#vantagens" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">Vantagens</a>
              <a href="/#como-funciona" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">Como Funciona</a>
              <a href="/#comissoes" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">Comissões</a>
            </nav>
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="px-4 py-2.5 border-2 border-orange-500/60 text-orange-300 font-bold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all">Início</button>
              <button onClick={redirectToLogin} className="group relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105">
                <span className="relative z-10 flex items-center text-white">Login<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></span>
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

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200 mx-auto mt-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Acessar Escritório Virtual - FSNET</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font.bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font.bold text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center justify-center">
            {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Entrando...</>) : ("Entrar")}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Não tem conta? <Link to="/cadastro" className="text-orange-600 font-bold">Cadastre-se</Link>
          <span className="mx-2">•</span>
          <Link to="/recuperar-senha" className="text-gray-700 font-bold">Esqueci minha senha</Link>
        </div>
      </div>

      {/* Footer (same as Cadastro) */}
      <footer className="border-t border-orange-500/20 py-12 mt-16" style={{ backgroundColor: '#0c5cb7' }}>
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
                Site oficial: {" "}
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
    </div>
  );
}

