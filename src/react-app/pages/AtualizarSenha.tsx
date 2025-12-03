import { useState } from "react";
import { supabase } from "@/shared/supabaseClient";
import { KeyRound, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function AtualizarSenha() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Senha alterada!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao atualizar senha");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Atualizar Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nova Senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar Senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" autoComplete="new-password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center justify-center">
            {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Salvando...</>) : ("Salvar Nova Senha")}
          </button>
        </form>
      </div>
    </div>
  );
}

