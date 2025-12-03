import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/shared/authContext";
import { getAffiliateByUserId } from "@/shared/affiliates";
import { orgUpdate } from "@/shared/orgDb";
import { Loader2, User, Phone, KeyRound, IdCard, Mail, Hash } from "lucide-react";

export default function DashboardProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [aff, setAff] = useState<any | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pixKey, setPixKey] = useState("");

  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      const a = await getAffiliateByUserId(user.id);
      setAff(a);
      setFullName(a?.full_name || "");
      setPhone(a?.phone || "");
      setPixKey(a?.pix_key || "");
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aff?.id) return;
    setSaving(true);
    await orgUpdate("affiliates", { id: aff.id }, { full_name: fullName, phone, pix_key: pixKey });
    setToast("Dados atualizados!");
    setTimeout(() => setToast(""), 1500);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <button onClick={()=>navigate('/dashboard')} className="px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">Voltar</button>
        </div>
        {toast && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{toast}</div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp/Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Chave Pix</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={pixKey} onChange={(e)=>setPixKey(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CPF (somente leitura)</label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100" value={aff?.cpf || ""} readOnly />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email (somente leitura)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100" value={user?.email || ""} readOnly />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Código de Indicação</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100" value={aff?.referral_code || ""} readOnly />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center justify-center">
            {saving ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Salvando...</>) : ("Salvar Alterações")}
          </button>
        </form>
      </div>
    </div>
  );
}

