import { NavLink, Outlet, useNavigate } from "react-router";
import { LogOut, LayoutDashboard, FilePlus2, Users, FileText, Gift } from "lucide-react";
import { useAuth } from "@/shared/authContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = async () => { await logout(); navigate("/"); };
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="text-2xl font-bold text-orange-600 mb-6">FSNET Admin</div>
        <nav className="space-y-2">
          <NavLink to="/admin" className={({isActive})=>`flex items-center px-3 py-2 rounded-lg ${isActive? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}><LayoutDashboard className="w-4 h-4 mr-2"/>Dashboard</NavLink>
          <NavLink to="/admin/lancamento" className={({isActive})=>`flex items-center px-3 py-2 rounded-lg ${isActive? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}><FilePlus2 className="w-4 h-4 mr-2"/>Lançar Venda</NavLink>
          <NavLink to="/admin/lancamento-bonus" className={({isActive})=>`flex items-center px-3 py-2 rounded-lg ${isActive? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}><Gift className="w-4 h-4 mr-2"/>Lançar Bônus Extra</NavLink>
          <NavLink to="/admin/afiliados" className={({isActive})=>`flex items-center px-3 py-2 rounded-lg ${isActive? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}><Users className="w-4 h-4 mr-2"/>Gerenciar Afiliados</NavLink>
          <NavLink to="/admin/contratos" className={({isActive})=>`flex items-center px-3 py-2 rounded-lg ${isActive? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}><FileText className="w-4 h-4 mr-2"/>Histórico de Contratos</NavLink>
          <button onClick={onLogout} className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 w-full"><LogOut className="w-4 h-4 mr-2"/>Sair</button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

