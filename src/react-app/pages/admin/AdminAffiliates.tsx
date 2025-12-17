import { useEffect, useMemo, useState } from "react";
import { orgSelect, orgUpdate, orgDelete } from "@/shared/orgDb";
import { Search, ToggleLeft, ToggleRight, Trash2, DollarSign, Eye, Pencil } from "lucide-react";
import { supabase } from "@/shared/supabaseClient";
import { FS_ORGANIZATION_ID } from "@/shared/tenant";
// 

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
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [financeOrders, setFinanceOrders] = useState<any[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewAffiliate, setViewAffiliate] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editAffiliate, setEditAffiliate] = useState<any | null>(null);
  // 
  const [payNetwork, setPayNetwork] = useState(false);

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

  const openEdit = (row: any) => {
    setEditAffiliate({ ...row });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editAffiliate) return;
    const { id, full_name, cpf, phone, email, pix_key, is_client } = editAffiliate;
    await orgUpdate("affiliates", { id }, { full_name, cpf, phone, email, pix_key, is_client });
    setToast("Afiliado atualizado");
    setTimeout(()=>setToast(""), 1500);
    setEditOpen(false);
    await load();
  };

  const sendPasswordReset = async () => {
    if (!editAffiliate?.email) { setToast("Afiliado sem e-mail"); setTimeout(()=>setToast(""), 1500); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(editAffiliate.email, { redirectTo: window.location.origin + "/atualizar-senha" });
    if (error) {
      console.error("Reset password error:", error);
      setToast("Erro ao enviar redefinição de senha: " + (error.message || ""));
    } else {
      setToast("Link de redefinição enviado");
    }
    setTimeout(()=>setToast(""), 2000);
  };

  const openFinance = async (row: any) => {
    setSelectedAffiliate(row);
    const list = await orgSelect("commissions", "*", (q: any) => q.eq("affiliate_id", row.id).eq("status", "pending"));
    setFinanceRows(list);
    setFinanceTotal(list.reduce((s: number, c: any) => s + Number(c.amount || 0), 0));
    setSelectedIds([]);
    const orders = await orgSelect("orders", "*", (q: any) => q.eq("affiliate_id", row.id));
    setFinanceOrders(orders);
    setFinanceOpen(true);
    setPayNetwork(false);
  };

  // 

  const paySelected = async () => {
    if (!selectedAffiliate || selectedIds.length === 0) return;
    setIsUploading(true);
    for (const id of selectedIds) {
      let proofUrl: string | null = null;
      if (file) {
        const ext = (file.name.split(".").pop() || "dat").toLowerCase();
        const key = `${FS_ORGANIZATION_ID}/${id}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("receipts").upload(key, file, { upsert: true, contentType: file.type || "application/octet-stream" });
        if (!upErr) {
          const { data } = supabase.storage.from("receipts").getPublicUrl(key);
          proofUrl = data.publicUrl || null;
        }
      }
      await orgUpdate("commissions", { id, status: "pending" }, { status: "paid", payment_date: new Date().toISOString(), admin_note: financeNote, proof_url: proofUrl, updated_at: new Date().toISOString() });
    }
    if (selectedAffiliate?.is_client && payNetwork) {
      try {
        const { apiDistributeNetworkBonus } = await import("@/react-app/api/admin/distribute-network-bonus");
        await apiDistributeNetworkBonus({ payer_id: selectedAffiliate.id });
        setToast("Pagamento confirmado e bônus de rede distribuído!");
      } catch (e: any) {
        console.error("Distribuição de bônus falhou:", e);
        setToast("Pagamento confirmado. Falha ao distribuir bônus de rede: " + (e?.message || "erro desconhecido"));
      }
    } else {
      setToast("Pagamentos marcados como pagos");
    }
    setTimeout(()=>setToast(""), 1500);
    const list = await orgSelect("commissions", "*", (q: any) => q.eq("affiliate_id", selectedAffiliate.id).eq("status", "pending"));
    setFinanceRows(list);
    setFinanceTotal(list.reduce((s: number, c: any) => s + Number(c.amount || 0), 0));
    setSelectedIds([]);
    setFinanceNote("");
    setFile(null);
    setIsUploading(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return [];
      if (prev.length === 0) return [id];
      return prev;
    });
  };

  // 

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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full border bg-gray-50">{r.is_active ? "Ativo" : "Bloqueado"}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${r.is_client ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>{r.is_client ? "Cliente" : "Não Cliente"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{r.created_at ? new Date(r.created_at).toLocaleDateString("pt-BR") : "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={()=>toggleActive(r)}
                      className={`p-2 rounded-lg border flex items-center justify-center ${
                        r.is_active ? 'text-red-600 border-red-300 hover:bg-red-50' : 'text-green-600 border-green-300 hover:bg-green-50'
                      }`}
                      title={r.is_active ? 'Bloquear' : 'Desbloquear'}
                    >
                      {r.is_active ? <ToggleRight className="w-4 h-4"/> : <ToggleLeft className="w-4 h-4"/>}
                    </button>
                    <button onClick={()=>openEdit(r)} className="p-2 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center" title="Editar">
                      <Pencil className="w-4 h-4"/>
                    </button>
                    <button onClick={()=>tryDelete(r)} className="p-2 rounded-lg border text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center" title="Excluir">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                    <button onClick={()=>{ setViewAffiliate(r); setViewOpen(true); }} className="p-2 rounded-lg border text-blue-600 border-blue-300 hover:bg-blue-50 flex items-center justify-center" title="Visualizar">
                      <Eye className="w-4 h-4"/>
                    </button>
                  </div>
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
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Sel</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Valor</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Cliente</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financeRows.map((c)=> (
                      <tr key={c.id}>
                        <td className="px-4 py-2">
                          <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={()=>toggleSelect(c.id)} disabled={selectedIds.length===1 && selectedIds[0]!==c.id} />
                        </td>
                        <td className="px-4 py-2">{c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : '-'}</td>
                        <td className="px-4 py-2">R$ {Number(c.amount).toFixed(2)}</td>
                        <td className="px-4 py-2">{financeOrders.find((o)=>o.id===c.order_id)?.customer_name || '-'}</td>
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
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Comprovante (imagem ou PDF)</label>
              <input type="file" accept="image/*,application/pdf" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="w-full" />
            </div>
            {selectedAffiliate?.is_client && (
              <div className="mt-4">
                <label className="inline-flex items-center text-sm font-bold text-gray-700">
                  <input type="checkbox" className="mr-2" checked={payNetwork} onChange={(e)=>setPayNetwork(e.target.checked)} />
                  Pagar Bônus de Rede (R$ 3,00)
                </label>
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">Total Pendente: <span className="font-bold">R$ {financeTotal.toFixed(2)}</span></div>
              <div className="flex items-center gap-3">
                  <button onClick={paySelected} disabled={selectedIds.length!==1 || isUploading} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                    {isUploading ? "Enviando comprovante..." : "Marcar como Pago"}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {viewOpen && viewAffiliate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Dados do Afiliado</h3>
              <button onClick={()=>setViewOpen(false)} className="text-gray-600 hover:text-gray-900">Fechar</button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Nome</div>
                <div className="font-bold text-gray-900">{viewAffiliate.full_name || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">Código</div>
                <div className="font-bold text-gray-900">{viewAffiliate.referral_code || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">WhatsApp</div>
                <div className="font-bold text-gray-900">{viewAffiliate.phone || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">CPF</div>
                <div className="font-bold text-gray-900">{viewAffiliate.cpf || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">Chave Pix</div>
                <div className="font-bold text-gray-900">{viewAffiliate.pix_key || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <div className="font-bold text-gray-900">{viewAffiliate.is_active ? 'Ativo' : 'Bloqueado'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500">Cadastro</div>
                <div className="font-bold text-gray-900">{viewAffiliate.created_at ? new Date(viewAffiliate.created_at).toLocaleDateString('pt-BR') : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editOpen && editAffiliate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Editar Afiliado</h3>
              <button onClick={()=>setEditOpen(false)} className="text-gray-600 hover:text-gray-900">Fechar</button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Nome</div>
                <input className="w-full px-3 py-2 border rounded" value={editAffiliate.full_name || ''} onChange={(e)=>setEditAffiliate((p:any)=>({...p, full_name: e.target.value}))}/>
              </div>
              <div>
                <div className="text-gray-500">Código</div>
                <input className="w-full px-3 py-2 border rounded bg-gray-100" value={editAffiliate.referral_code || ''} readOnly/>
              </div>
              <div>
                <div className="text-gray-500">WhatsApp</div>
                <input className="w-full px-3 py-2 border rounded" value={editAffiliate.phone || ''} onChange={(e)=>setEditAffiliate((p:any)=>({...p, phone: e.target.value}))}/>
              </div>
              <div>
                <div className="text-gray-500">CPF</div>
                <input className="w-full px-3 py-2 border rounded" value={editAffiliate.cpf || ''} onChange={(e)=>setEditAffiliate((p:any)=>({...p, cpf: e.target.value}))}/>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <input className="w-full px-3 py-2 border rounded" value={editAffiliate.email || ''} onChange={(e)=>setEditAffiliate((p:any)=>({...p, email: e.target.value}))}/>
              </div>
              <div>
                <div className="text-gray-500">Chave Pix</div>
                <input className="w-full px-3 py-2 border rounded" value={editAffiliate.pix_key || ''} onChange={(e)=>setEditAffiliate((p:any)=>({...p, pix_key: e.target.value}))}/>
              </div>
              <div className="md:col-span-2 flex items-center gap-4 mt-2">
                <label className="inline-flex items-center"><input type="checkbox" className="mr-2" checked={!!editAffiliate.is_client} onChange={(e)=>setEditAffiliate((p:any)=>({...p, is_client: e.target.checked}))}/> Cliente</label>
                <label className="inline-flex items-center"><input type="checkbox" className="mr-2" checked={!!editAffiliate.is_active} onChange={(e)=>setEditAffiliate((p:any)=>({...p, is_active: e.target.checked}))}/> Ativo</label>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500 mb-1">Senha</div>
                <div className="flex items-center gap-2">
                  <button onClick={sendPasswordReset} className="px-3 py-2 border rounded text-sm text-indigo-700">Enviar link de redefinição</button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button onClick={()=>setEditOpen(false)} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-orange-600 text-white rounded">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

