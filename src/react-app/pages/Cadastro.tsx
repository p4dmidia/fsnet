import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/shared/authContext";
import { Loader2, User, Phone, Mail, KeyRound, IdCard, ArrowRight } from "lucide-react";
import { generateReferralCode } from "@/shared/affiliates";
import { signUpWithEmailPassword, signInWithPassword } from "@/shared/auth";
import { supabase } from "@/shared/supabaseClient";
import { FS_ORGANIZATION_ID } from "@/shared/tenant";

export default function Cadastro() {
  const navigate = useNavigate();
  const {} = useAuth();
  const location = useLocation();
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferredByCode(ref);
      setHasRefParam(true);
    }
  }, [location.search]);
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [referredByCode, setReferredByCode] = useState("");
  const [hasRefParam, setHasRefParam] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMountedRef.current) {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
    }
    const emailValid = email && email.includes("@");
    const passwordValid = password && password.length >= 6;
    const nameValid = fullName && fullName.trim().length > 1;
    if (!emailValid || !passwordValid || !nameValid) {
      if (isMountedRef.current) setError("Preencha nome, e-mail válido e senha (mín. 6)");
      if (isMountedRef.current) setIsSubmitting(false);
      return;
    }
    try {
      const userId = await signUpWithEmailPassword(email, password);
      if (!userId) throw new Error("Falha ao criar usuário. Verifique seu e-mail.");
      try {
        await signInWithPassword(email, password);
      } catch {}
      const session = await (await import("@/shared/supabaseClient")).supabase.auth.getSession();
      console.log("Supabase session after signUp/signIn:", session);
      const updatePayload = { organization_id: FS_ORGANIZATION_ID, full_name: fullName };
      let up = await (supabase.from("profiles") as any).update(updatePayload).eq("id", userId).select();
      if (up.error || (up.data && up.data.length === 0)) {
        up = await (supabase.from("profiles") as any).update(updatePayload).eq("user_id", userId).select();
      }
      console.log("Profile update:", up);
      const referral_code = generateReferralCode(fullName);
      const payload = {
        user_id: userId,
        full_name: fullName,
        cpf,
        phone,
        referral_code,
        pix_key: pixKey ?? null,
        is_client: isClient,
        referred_by_code: referredByCode || null,
        organization_id: FS_ORGANIZATION_ID,
      };
      console.log("Payload:", payload);
      let { data, error } = await (supabase.from("affiliates") as any).insert(payload).select().single();
      if (error) {
        console.error("Insert error:", error);
        // Fallback: attempt minimal payload without user_id
        const minimal = { full_name: fullName, phone, referral_code, organization_id: FS_ORGANIZATION_ID };
        console.log("Retry with minimal payload:", minimal);
        const res = await (supabase.from("affiliates") as any).insert(minimal).select().single();
        if (res.error) throw res.error;
        data = res.data;
      }
      setSuccess(`Cadastro concluído! Seu código: ${data.referral_code}`);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar";
      const isDup = (err as any)?.status === 422 || (msg.toLowerCase().includes("already registered")) || (msg.toLowerCase().includes("duplic")) || (msg.toLowerCase().includes("existing"));
      if (isDup) {
        if (isMountedRef.current) setError("Este email já possui cadastro. Tente fazer login.");
        navigate("/login");
        return;
      }
      if (isMountedRef.current) setError(msg);
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#0c5cb7' }}>
      {/* Header (from Home) */}
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
              <a href="/#inicio" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Início
              </a>
              <a href="/#vantagens" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Vantagens
              </a>
              <a href="/#como-funciona" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Como Funciona
              </a>
              <a href="/#comissoes" className="text-gray-300 hover:text-orange-400 font-medium transition-all duration-300 hover:scale-105">
                Comissões
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2.5 border-2 border-orange-500/60 text-orange-300 font-bold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all"
              >
                Início
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

      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200 mx-auto mt-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastro de Afiliado</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={fullName} onChange={(e)=>setFullName(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={cpf} onChange={(e)=>setCpf(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Código de Indicação (Quem te indicou?)</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                value={referredByCode}
                onChange={(e)=>!hasRefParam && setReferredByCode(e.target.value)}
                readOnly={hasRefParam}
                placeholder="Ex: ABC12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" autoComplete="email" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" autoComplete="new-password" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={password} onChange={(e)=>setPassword(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Chave Pix</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={pixKey} onChange={(e)=>setPixKey(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <label className="inline-flex items-center text-sm font-bold text-gray-700">
              <input type="checkbox" className="mr-2" checked={isClient} onChange={(e)=>setIsClient(e.target.checked)} />
              Sou Cliente FS Net
            </label>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center justify-center">
            {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Salvando...</>) : ("Cadastrar")}
          </button>
        </form>
      </div>
      {/* Footer (from Home) */}
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

