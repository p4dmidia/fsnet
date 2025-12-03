import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { exchangeCodeForSessionToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate("/dashboard");
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="animate-spin mb-4">
        <Loader2 className="w-12 h-12 text-orange-600" />
      </div>
      <p className="text-gray-700 text-lg font-medium">Autenticando...</p>
    </div>
  );
}
