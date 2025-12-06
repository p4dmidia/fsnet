import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, User, Package, Hash } from "lucide-react";
import { getAffiliateByReferralCode } from "@/shared/affiliates";
import { createOrder, createCommission } from "@/shared/orders";

const PLAN_VALUES: Record<string, { price: number; commission: number }> = {
  "500MB": { price: 100, commission: 30 },
  "800MB": { price: 130, commission: 60 },
};

export default function AdminLancamento() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [plan, setPlan] = useState("");
  const [refCode, setRefCode] = useState("");
  const [affiliateName, setAffiliateName] = useState<string | null>(null);
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRefChange = async (value: string) => {
    setRefCode(value.trim());
    setAffiliateName(null);
    setAffiliateId(null);
    setError("");
    if (!value.trim()) return;
    setIsValidating(true);
    try {
      const aff = await getAffiliateByReferralCode(value.trim());
      if (aff) {
        setAffiliateName(aff.full_name ?? "Afiliado");
        setAffiliateId(aff.id);
      } else {
        setError("Código inválido");
      }
    } catch (e) {
      setError("Erro ao validar código");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!affiliateId) {
      setError("Informe um código de indicação válido");
      return;
    }
    if (!plan || !PLAN_VALUES[plan]) {
      setError("Selecione um plano válido");
      return;
    }
    setIsSubmitting(true);
    try {
      const { price, commission } = PLAN_VALUES[plan];
      const payload = {
        affiliate_id: affiliateId!,
        customer_name: customerName,
        customer_phone: "",
        customer_email: null,
        amount: Number(price),
        status: "pending",
        subscription_plan_id: null,
        plan_name: plan,
        referred_by_code: refCode,
        commission_amount: commission,
      };
      console.log("Payload Venda:", payload);
      const order = await createOrder(payload);
      await createCommission({ affiliate_id: affiliateId!, order_id: order.id, amount: commission, status: "pending" });
      setSuccess("Venda lançada com sucesso!");
      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao lançar venda");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Lançamento de Vendas (Admin)</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Cliente</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} required />
            </div>
          </div>

          

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Plano Contratado</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={plan} onChange={(e)=>setPlan(e.target.value)} required>
                <option value="">Selecione</option>
                <option value="500MB">500MB</option>
                <option value="800MB">800MB</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Código do Afiliado Indicador</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" value={refCode} onChange={(e)=>handleRefChange(e.target.value)} required />
            </div>
            <div className="mt-2 text-sm">
              {isValidating && <span className="text-gray-500">Validando...</span>}
              {affiliateName && <span className="text-green-600">Indicado por: {affiliateName}</span>}
              {!affiliateName && refCode && !isValidating && error === "Código inválido" && <span className="text-red-600">Código inválido</span>}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center justify-center">
            {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Lançando...</>) : ("Lançar Venda")}
          </button>
        </form>
      </div>
    </div>
  );
}

