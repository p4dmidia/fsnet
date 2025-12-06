import { useEffect, useMemo, useState } from "react";
import { orgSelect } from "@/shared/orgDb";

export default function AdminContracts() {
  const [orders, setOrders] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  useEffect(() => { (async ()=>{ setOrders(await orgSelect("orders","*")); setAffiliates(await orgSelect("affiliates","*")); })(); }, []);

  const rows = useMemo(() => {
    const mapAff: Record<string, any> = {}; affiliates.forEach(a => { mapAff[a.id] = a; });
    return orders.map(o => {
      const a = mapAff[o.affiliate_id] || {}; 
      return {
        id: o.id,
        date: o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-",
        customer: o.customer_name || "-",
        plan: o.plan_name || "-",
        affiliate: a.full_name ? `${a.full_name} (${a.referral_code || '-'})` : "-",
        commission: (o.commission_amount != null) ? `R$ ${Number(o.commission_amount).toFixed(2)}` : "-",
        notes: o.notes || "",
      };
    });
  }, [orders, affiliates]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Histórico de Contratos</h2>
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Data</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Plano</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Afiliado</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Comissão</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Observação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.customer}</td>
                  <td className="px-4 py-3">{r.plan}</td>
                  <td className="px-4 py-3">{r.affiliate}</td>
                  <td className="px-4 py-3">{r.commission}</td>
                  <td className="px-4 py-3">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

