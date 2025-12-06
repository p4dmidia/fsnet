import { useEffect, useMemo, useState } from "react";
import { orgSelect, orgUpdate, orgDelete } from "@/shared/orgDb";
import { Search, ToggleLeft, ToggleRight, Trash2, DollarSign } from "lucide-react";

export default function AdminAffiliates() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [_, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [financeOpen, setFinanceOpen] = useState(false);
  const [financeRows, setFinanceRows] = useState<any[]>([]);
  const [financeTotal, setFinanceTotal] = useState(0);
  const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [financeNote, setFinanceNote] = useState("");

  const load = async () => {
    setLoading(true);
    const a = await orgSelect("affiliates", "*");
    setRows(a);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return rows.filter((r) => (r.full_name || "").toLowerCase().includes(s) || (r.referral_code || "").toLowerCase().includes(s));
  }, [rows, q]);

  const toggleActive = async (row: any) => {
    await orgUpdate("affiliates", { id: row.id }, { is_active: !row.is_active });
    setToast(`Afiliado ${!row.is_active ? 'desbloqueado' : 'bloqueado'} com sucesso`);
    setTimeout(()=>setToast(""), 1500);
    await load();
  };

  const openFinance = async (row: any) => {
    setSelectedAffiliate(row);
    const list = await orgSelect("commissions", "*", (q: any) => q.eq("affiliate_id", row.id).eq("status", "pending"));
    setFinanceRows(list);
    setFinanceTotal(list.reduce((s: number, c: any) => s + Number(c.amount || 0), 0));
    setSelectedIds([]);
    setFinanceOpen(true);
  };

  const paySelected = async () => {
    if (!selectedAffiliate || selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await orgUpdate("commissions", { id, status: "pending" }, { status: "paid", payment_date: new Date().toISOString(), admin_note: financeNote, updated_at: new Date().toISOString() });
    }
    setToast("Pagamentos marcados como pagos");
    setTimeout(()=>setToast(""), 1500);
    const list = await orgSelect("commissions", "*", (q: any) => q.eq("affiliate_id", selectedAffiliate.id).eq("status", "pending"));
    setFinanceRows(list);
    setFinanceTotal(list.reduce((s: number, c: any) => s + Number(c.amount || 0), 0));
    setSelectedIds([]);
    setFinanceNote("");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const allIds = financeRows.map((c)=>c.id);
    const allSelected = selectedIds.length === allIds.length && allIds.length > 0;
    setSelectedIds(allSelected ? [] : allIds);
  };

  const tryDelete = async (row: any) => {
    const count = (await orgSelect("orders", "*", (q: any) => q.eq("affiliate_id", row.id))).length;
    if (count > 0) {
      alert("Afiliado possui vendas. Em vez de excluir, use o bloqueio.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este afiliado?")) {
      await orgDelete("affiliates", { id: row.id });
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Afiliados</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por nome ou código" className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
      {toast && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{toast}</div>}

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Código</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">WhatsApp</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Cadastro</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Ações</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Financeiro</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.full_name || "-"}</td>
                  <td className="px-4 py-3">{r.referral_code || "-"}</td>
                  <td className="px-4 py-3">{r.phone || "-"}</td>
                  <td className="px-4 py-3">{r.is_active ? "Ativo" : "Bloqueado"}</td>
                  <td className="px-4 py-3">{r.created_at ? new Date(r.created_at).toLocaleDateString("pt-BR") : "-"}</td>
                  <td className="px-4 py-3">
                    <button onClick={()=>toggleActive(r)} className="px-3 py-1 border rounded-lg mr-2 text-sm">
                      {r.is_active ? <ToggleRight className="w-4 h-4 inline"/> : <ToggleLeft className="w-4 h-4 inline"/>}
                      <span className="ml-1">{r.is_active ? "Bloquear" : "Desbloquear"}</span>
                    </button>
                    <button onClick={()=>tryDelete(r)} className="px-3 py-1 border rounded-lg text-sm text-red-600">
                      <Trash2 className="w-4 h-4 inline"/> Excluir
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>openFinance(r)} className="px-3 py-1 border rounded-lg text-sm text-green-700">
                      <DollarSign className="w-4 h-4 inline"/> Financeiro
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {financeOpen && selectedAffiliate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Gestão Financeira - {selectedAffiliate.full_name}</h3>
              <button onClick={()=>setFinanceOpen(false)} className="text-gray-600 hover:text-gray-900">Fechar</button>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">
                        <input type="checkbox" checked={selectedIds.length === financeRows.length && financeRows.length>0} onChange={toggleSelectAll} />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Valor</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Origem</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financeRows.map((c)=> (
                      <tr key={c.id}>
                        <td className="px-4 py-2">
                          <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={()=>toggleSelect(c.id)} />
                        </td>
                        <td className="px-4 py-2">{c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : '-'}</td>
                        <td className="px-4 py-2">R$ {Number(c.amount).toFixed(2)}</td>
                        <td className="px-4 py-2">{c.order_id || '-'}</td>
                      </tr>
                    ))}
                    {financeRows.length === 0 && (
                      <tr><td className="px-4 py-4 text-center text-gray-500" colSpan={4}>Sem pendências</td></tr>
                    )}
                  </tbody>
              </table>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Observação de Pagamento (opcional)</label>
              <textarea value={financeNote} onChange={(e)=>setFinanceNote(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-24" placeholder="Ex: Valor abatido na mensalidade de internet" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">Total Pendente: <span className="font-bold">R$ {financeTotal.toFixed(2)}</span></div>
              <div className="flex items-center gap-3">
                <button onClick={toggleSelectAll} disabled={financeRows.length===0} className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">Selecionar tudo</button>
                  <button onClick={paySelected} disabled={selectedIds.length===0} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">Marcar como Pago</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

