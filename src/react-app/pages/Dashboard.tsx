import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/shared/authContext";
import {
  Loader2,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  LogOut,
  Package,
  Share2,
  Info,
  Paperclip,
} from "lucide-react";
import { getAffiliateByUserId } from "@/shared/affiliates";
import { orgSelect } from "@/shared/orgDb";

interface DashboardStats {
  totalSales: number;
  totalCommission: number;
  pendingSales: number;
  approvedSales: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isPending, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [affiliateName, setAffiliateName] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const aff = await getAffiliateByUserId(user.id);
        if (aff) {
          setAffiliateCode(aff.referral_code ?? null);
          setAffiliateName(aff.full_name ?? null);
        }
        const myComms = aff ? await orgSelect("commissions", "*", (q: any) => q.eq("affiliate_id", aff.id)) : [];
        setCommissions(myComms);
        const ordersList = aff ? await orgSelect("orders", "*", (q: any) => q.eq("affiliate_id", aff.id)) : [];
        setMyOrders(ordersList);
        const totalSales = ordersList.length;
        const totalCommission = myComms.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);
        const pendingSales = myComms.filter((c: any) => c.status === "pending").length;
        const approvedSales = myComms.filter((c: any) => c.status === "paid" || c.status === "approved").length;
        setStats({ totalSales, totalCommission, pendingSales, approvedSales });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleShare = () => {
    const code = affiliateCode ?? "";
    const link = `https://wa.me/557192027955?text=${encodeURIComponent(
      `Olá, tenho interesse na internet da FS NET. Fui indicado pelo código ${code}.`
    )}`;
    const message = `Olá, para contratar os planos de internet da FSNET, clique aqui:\n${link}`;
    const ClipboardItemCtor = (window as any).ClipboardItem;
    if ((navigator.clipboard as any)?.write && ClipboardItemCtor) {
      const html = `<a href="${link}">${link}</a>`;
      const item = new ClipboardItemCtor({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([message], { type: "text/plain" }),
      });
      (navigator.clipboard as any).write([item]).catch(() => {
        (navigator.clipboard as any)?.writeText(message);
      });
    } else {
      (navigator.clipboard as any)?.writeText(message);
    }
  };

  

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://mocha-cdn.com/019ac2fa-a558-7768-8e76-5c00fcfcc0ca/logo-hydrovive-(5).png"
              alt="FSNet Logo"
              className="h-24 w-auto rounded-lg shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-orange-600">Escritório Virtual - Afiliados</h1>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Boas-vindas */}
        <div className="mb-4">
          <div className="text-lg font-bold text-gray-700">Olá, {affiliateName ?? user?.email ?? "Afiliado"}</div>
        </div>

        {/* Código de Indicação */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 font-medium">Seu Código de Indicação</div>
              <div className="text-3xl font-bold text-orange-600">{affiliateCode ?? "--"}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copiar link
              </button>
              <Link to="/dashboard/perfil" className="px-4 py-2.5 border-2 border-orange-300 rounded-lg font-bold text-orange-700 hover:bg-orange-50 transition-colors">Meu Perfil</Link>
            </div>
        </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalSales ?? 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total de Vendas</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              R$ {(stats?.totalCommission ?? 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Comissões Totais</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.pendingSales ?? 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Vendas Pendentes</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.approvedSales ?? 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Vendas Aprovadas</div>
          </div>
        </div>

        {/* Tabela de Comissionamento */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Tabela de Comissionamento</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Plano</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Mensalidade</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Comissão</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3">500 MB</td>
                  <td className="px-4 py-3">R$ 100,00</td>
                  <td className="px-4 py-3">R$ 30,00</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">800 MB</td>
                  <td className="px-4 py-3">R$ 130,00</td>
                  <td className="px-4 py-3">R$ 60,00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            As comissões geradas entre os dias <span className="font-bold">1 e 30</span> de cada mês são pagas entre os dias <span className="font-bold">20 e 25</span> do mês subsequente.
          </div>
        </div>

        {/* Minhas Comissões */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Minhas Comissões</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {commissions.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma comissão registrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Assim que o admin lançar a venda, sua comissão aparece aqui
                </p>
              </div>
            ) : (
              commissions.map((comm) => (
                <div key={comm.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Comissão</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            comm.status === "approved" || comm.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : comm.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {comm.status === "paid"
                            ? "Paga"
                            : comm.status === "approved"
                            ? "Aprovada"
                            : comm.status === "pending"
                            ? "Pendente"
                            : "Rejeitada"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          {comm.order_id}
                        </div>
                        {myOrders.find((o)=>o.id===comm.order_id)?.customer_name && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            {myOrders.find((o)=>o.id===comm.order_id)?.customer_name}
                          </div>
                        )}
                        <div className="flex items-start">
                          <Info className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <span className="text-gray-600 break-words whitespace-pre-wrap">{(comm.description && String(comm.description).trim().length>0) ? comm.description : 'Comissão de Venda'}</span>
                        </div>
                        {comm.admin_note && (
                          <div className="flex items-start" title={comm.admin_note as string}>
                            <Info className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                            <span className="text-gray-600 break-words whitespace-pre-wrap">{comm.admin_note as string}</span>
                          </div>
                        )}
                        {comm.proof_url && (
                          <div className="flex items-center">
                            <Paperclip className="w-4 h-4 mr-2 text-gray-400" />
                            <a href={comm.proof_url} target="_blank" rel="noreferrer" className="text-orange-600 font-bold">Comprovante</a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-xl font-bold text-gray-900 mb-2">
                        R$ {Number(comm.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}
