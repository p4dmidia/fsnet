import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { signInWithPassword, signOut, getSession, isAdminOfFSNet } from "@/shared/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
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
      const session = await getSession();
      const userId = session?.user?.id;
      const ok = userId ? await isAdminOfFSNet(userId) : false;
      if (ok) {
        navigate("/admin/lancamento");
      } else {
        await signOut();
        setError("Acesso restrito a administradores");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Acesso Administrativo - FS NET</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center">
            {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Entrando...</>) : ("Entrar")}
          </button>
        </form>
      </div>
    </div>
  );
}

