import { useState } from "react";
import { orgSelect } from "@/shared/orgDb";
import { ChevronRight, ChevronDown, Star, User, CheckCircle, XCircle } from "lucide-react";

function Node({ node, level = 1 }: { node: any; level?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<any[] | null>(null);
  const canExpand = level < 3;
  const toggle = async () => {
    if (!canExpand) return;
    if (!expanded && children === null) {
      const rows = await orgSelect("affiliates", "*", (qb: any) => qb.eq("referred_by_code", node.referral_code));
      setChildren(rows);
    }
    setExpanded((p) => !p);
  };
  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 py-2">
        {canExpand ? (
          <button onClick={toggle} className="p-1 rounded hover:bg-gray-100">
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
          </button>
        ) : (
          <span className="w-4 h-4" />
        )}
        <User className="w-4 h-4 text-gray-500" />
        <span className="font-bold text-gray-900">{node.full_name || "-"}</span>
        {node.is_active ? (
          <span className="flex items-center text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
            <CheckCircle className="w-3 h-3 mr-1" /> Ativo
          </span>
        ) : (
          <span className="flex items-center text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-0.5">
            <XCircle className="w-3 h-3 mr-1" /> Inativo
          </span>
        )}
        {node.is_client ? <Star className="w-4 h-4 text-yellow-500" /> : <Star className="w-4 h-4 text-gray-300" />}
      </div>
      {expanded && children && children.length > 0 && (
        <div className="ml-6 border-l border-gray-200 pl-4">
          {children.map((c) => (
            <Node key={c.id} node={c} level={level + 1} />
          ))}
        </div>
      )}
      {expanded && children && children.length === 0 && <div className="ml-6 text-xs text-gray-500">Sem indicados</div>}
    </div>
  );
}

export default function NetworkTree({ root }: { root: any }) {
  if (!root?.is_client) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        Torne-se cliente para ver sua rede e ganhar sobre ela
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Minha Rede</h3>
      <div>
        <Node node={root} level={1} />
      </div>
    </div>
  );
}
