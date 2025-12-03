import { useEffect, useMemo, useState } from "react";
import { orgSelect } from "@/shared/orgDb";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ranges = [
  { label: "Hoje", days: 0 },
  { label: "Ontem", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "15 dias", days: 15 },
  { label: "30 dias", days: 30 },
  { label: "Todo o período", days: 3650 },
];

const COLORS = ["#f97316", "#10b981", "#3b82f6", "#ef4444", "#a855f7"]; 

export default function AdminDashboard() {
  const [range, setRange] = useState(ranges[2]);
  const [orders, setOrders] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const now = new Date();
      const start = range.label === "Todo o período" ? new Date(0) : startOfDay(subDays(now, range.days));
      const end = endOfDay(now);
      const o = await orgSelect("orders", "*", (q: any) => q.gte("created_at", start.toISOString()).lte("created_at", end.toISOString()));
      const c = await orgSelect("commissions", "*", (q: any) => q.gte("created_at", start.toISOString()).lte("created_at", end.toISOString()));
      setOrders(o);
      setCommissions(c);
      setLoading(false);
    })();
  }, [range]);

  const kpis = useMemo(() => {
    const totalSales = orders.length;
    const totalAmount = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
    const paid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.amount || 0), 0);
    const pending = commissions.filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.amount || 0), 0);
    const ticket = totalSales ? totalAmount / totalSales : 0;
    return { totalSales, paid, pending, ticket };
  }, [orders, commissions]);

  const lineData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const d = format(new Date(o.created_at), "dd/MM");
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [orders]);

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const p = o.plan_name || "N/A";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const [affiliates, setAffiliates] = useState<any[]>([]);
  const topAffiliates = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { const id = o.affiliate_id; counts[id] = (counts[id] || 0) + 1; });
    const rows = affiliates.map((a) => ({ name: a.full_name || "-", code: a.referral_code || "-", id: a.id, sales: counts[a.id] || 0 }));
    return rows.sort((a,b)=>b.sales-a.sales).slice(0,10);
  }, [orders, affiliates]);

  useEffect(() => { (async () => { const a = await orgSelect("affiliates", "*"); setAffiliates(a); })(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
        <select value={range.label} onChange={(e)=>setRange(ranges.find(r=>r.label===e.target.value) || ranges[2])} className="border border-gray-300 rounded-lg px-3 py-2">
          {ranges.map((r)=> (<option key={r.label} value={r.label}>{r.label}</option>))}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="text-sm text-gray-600">Novos Contratos</div>
          <div className="text-3xl font-bold text-gray-900">{kpis.totalSales}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="text-sm text-gray-600">Comissões Pagas</div>
          <div className="text-3xl font-bold text-green-600">R$ {kpis.paid.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="text-sm text-gray-600">Comissões Pendentes</div>
          <div className="text-3xl font-bold text-yellow-600">R$ {kpis.pending.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="text-sm text-gray-600">Ticket Médio</div>
          <div className="text-3xl font-bold text-blue-600">R$ {kpis.ticket.toFixed(2)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Evolução de Vendas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Vendas por Plano</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Affiliates */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 10 Afiliados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Afiliado</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Código</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Vendas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topAffiliates.map((row)=> (
                <tr key={row.id}>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.code}</td>
                  <td className="px-4 py-3">{row.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

