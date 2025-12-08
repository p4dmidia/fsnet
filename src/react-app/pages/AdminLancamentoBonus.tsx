import { useEffect, useMemo, useState } from "react";
import { orgInsert, orgSelect } from "@/shared/orgDb";
import { Search, CheckCircle } from "lucide-react";

export default function AdminLancamentoBonus() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [openList, setOpenList] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning">("success");

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = query.trim();
      if (!q) { setResults([]); return; }
      const rows = await orgSelect("affiliates", "*", (qb: any) => qb.or(`full_name.ilike.%${q}%,cpf.ilike.%${q}%`));
      setResults(rows);
      setOpenList(true);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const canSave = useMemo(() => {
    return !!selected && !!amount && Number(amount) > 0 && description.trim().length > 0 && !saving;
  }, [selected, amount, description, saving]);

  const onPick = (row: any) => {
    setSelected(row);
    setQuery(row.full_name || "");
    setOpenList(false);
  };

  const onSave = async () => {
    if (!selected || !amount || Number(amount) <= 0 || description.trim().length === 0) {
      setToastType("warning");
      setToast("Selecione um afiliado e informe um valor maior que zero e descrição");
      setTimeout(()=>setToast(""), 2000);
      return;
    }
    setSaving(true);
    try {
      await orgInsert("commissions", {
        affiliate_id: selected.id,
        amount: Number(amount),
        status: "pending",
        description,
        order_id: null,
      });
      setToastType("success");
      setToast("Comissão extra lançada com sucesso");
      setTimeout(()=>setToast(""), 1500);
      setAmount("");
      setDescription("");
    } catch (error: any) {
      console.error("Erro ao lançar bônus:", error);
      setToastType("error");
      setToast("Erro ao lançar bônus: " + (error?.message || "Falha desconhecida"));
      setTimeout(()=>setToast(""), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Lançar Bônus Extra</h2>
      {toast && (
        <div className={`${toastType==='success' ? 'bg-green-50 border-green-200 text-green-700' : toastType==='error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'} border px-4 py-3 rounded-lg flex items-center`}>
          <CheckCircle className="w-4 h-4 mr-2"/> {toast}
        </div>
      )}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-2">Buscar Afiliado (Nome ou CPF)</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e)=>{ setQuery(e.target.value); setOpenList(true); }}
            placeholder="Digite para buscar"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          {openList && results.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
              {results.map((r)=> (
                <button key={r.id} onClick={()=>onPick(r)} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                  <div className="font-bold text-gray-900">{r.full_name || "-"}</div>
                  <div className="text-xs text-gray-600">CPF: {r.cpf || "-"} • Código: {r.referral_code || "-"}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: 50.00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
              <textarea
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-24"
                placeholder="Ex: Bônus de Meta Batida"
              />
            </div>
            <div className="flex items-center justify-end">
              <button onClick={onSave} disabled={!canSave} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50">
                Lançar Comissão
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
