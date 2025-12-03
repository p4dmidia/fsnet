import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/shared/authContext";
import { Loader2, UserCircle, Phone } from "lucide-react";
import { createAffiliateForExternalUser } from "@/shared/affiliates";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!user?.id) throw new Error("Sessão inválida. Faça login novamente.");
      await createAffiliateForExternalUser(user.id, fullName, phone);

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <UserCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</h1>
          <p className="text-gray-600">Complete seu cadastro para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Digite seu nome completo"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
              Telefone/WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Criando perfil...
              </>
            ) : (
              "Começar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
