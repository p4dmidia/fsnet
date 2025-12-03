import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/shared/authContext";
import HomePage from "@/react-app/pages/Home";
import DashboardPage from "@/react-app/pages/Dashboard";
import DashboardProfile from "@/react-app/pages/DashboardProfile";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import OnboardingPage from "@/react-app/pages/Onboarding";
import LojaPage from "@/react-app/pages/Loja";
import CadastroPage from "@/react-app/pages/Cadastro";
import AdminLancamentoPage from "@/react-app/pages/AdminLancamento";
import AdminLayout from "@/react-app/pages/admin/AdminLayout";
import AdminDashboard from "@/react-app/pages/admin/AdminDashboard";
import AdminAffiliates from "@/react-app/pages/admin/AdminAffiliates";
import AdminContracts from "@/react-app/pages/admin/AdminContracts";
import LoginPage from "@/react-app/pages/Login";
import AdminLoginPage from "@/react-app/pages/AdminLogin";
import { getSession, isAdminOfFSNet } from "@/shared/auth";
import { Navigate } from "react-router";
import RecuperarSenha from "@/react-app/pages/RecuperarSenha";
import AtualizarSenha from "@/react-app/pages/AtualizarSenha";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loja" element={<LojaPage />} />
          
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedUserRoute>
                <DashboardPage />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/dashboard/perfil"
            element={
              <ProtectedUserRoute>
                <DashboardProfile />
              </ProtectedUserRoute>
            }
          />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/atualizar-senha" element={<AtualizarSenha />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="lancamento" element={<AdminLancamentoPage />} />
            <Route path="afiliados" element={<AdminAffiliates />} />
            <Route path="contratos" element={<AdminContracts />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ProtectedUserRoute({ children }: { children: React.ReactElement }) {
  const [allowed, setAllowed] = React.useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    (async () => {
      const session = await getSession();
      setAllowed(!!session);
      const ok = session?.user?.id ? await isAdminOfFSNet(session.user.id) : false;
      setIsAdmin(!!ok);
    })();
  }, []);
  if (allowed === null || isAdmin === null) return null;
  if (!allowed) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
}

function AdminRoute({ children }: { children: React.ReactElement }) {
  const [allowed, setAllowed] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    (async () => {
      const session = await getSession();
      const ok = session?.user?.id ? await isAdminOfFSNet(session.user.id) : false;
      setAllowed(!!ok);
    })();
  }, []);
  if (allowed === null) return null;
  return allowed ? children : <Navigate to="/admin/login" replace />;
}
